import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
  calculateEuclideanDistance,
  isValidFaceDescriptor,
  findMatchingUser,
} from "../utils/faceMatcher.js";

const MATCH_THRESHOLD = parseFloat(process.env.FACE_MATCH_THRESHOLD || "0.5");
// Jam batas masuk tepat waktu: 08:30:00 (Format lokal)
const ON_TIME_HOUR = 8;
const ON_TIME_MINUTE = 30;

function getStartAndEndOfToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

/**
 * Endpoint Utama Kiosk Mesin Absensi:
 * Menerima embedding wajah dari kamera, mencocokkan dengan seluruh user di DB,
 * lalu otomatis mencatat Absen Masuk (IN) atau Absen Pulang (OUT).
 */
export async function scanAttendance(req: Request, res: Response) {
  try {
    const { faceDescriptor, snapshotUrl } = req.body;

    if (!faceDescriptor || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({
        success: false,
        message: "Data biometrik wajah tidak valid (vektor 128-D diperlukan).",
      });
    }

    // Ambil semua member yang terdaftar
    const allMembers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        memberCode: true,
        email: true,
        department: true,
        faceDescriptor: true,
        faceImageUrl: true,
      },
    });

    if (allMembers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Belum ada anggota/karyawan yang terdaftar. Hubungi Admin.",
      });
    }

    // Pencocokan 1:N Euclidean Distance
    const { matchedUser, minDistance } = findMatchingUser(
      faceDescriptor,
      allMembers,
      MATCH_THRESHOLD
    );

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Wajah tidak dikenali dalam sistem. Silakan hubungi Admin untuk pendaftaran.",
        minDistance,
        threshold: MATCH_THRESHOLD,
      });
    }

    const { start, end } = getStartAndEndOfToday();

    // Ambil riwayat absensi user untuk hari ini
    const todayAttendances = await prisma.attendance.findMany({
      where: {
        userId: matchedUser.id,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const now = new Date();

    // Cooldown anti-spam: Jika baru saja absen kurang dari 20 detik yang lalu
    const lastScan = todayAttendances[todayAttendances.length - 1];
    if (lastScan) {
      const diffSeconds = (now.getTime() - new Date(lastScan.createdAt).getTime()) / 1000;
      if (diffSeconds < 20) {
        return res.status(429).json({
          success: false,
          isCooldown: true,
          message: `Absensi ${lastScan.type === "IN" ? "Masuk" : "Pulang"} Anda baru saja tercatat ${Math.round(diffSeconds)} detik lalu.`,
          user: {
            id: matchedUser.id,
            name: matchedUser.name,
            memberCode: matchedUser.memberCode,
            department: matchedUser.department,
            faceImageUrl: matchedUser.faceImageUrl,
          },
          attendance: lastScan,
        });
      }
    }

    let type: "IN" | "OUT" = "IN";
    let status: "ON_TIME" | "LATE" = "ON_TIME";
    let message = "";

    const hasIn = todayAttendances.some((a) => a.type === "IN");
    const hasOut = todayAttendances.some((a) => a.type === "OUT");

    if (!hasIn) {
      // Pertama kali absen hari ini -> Masuk (IN)
      type = "IN";
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (
        currentHour > ON_TIME_HOUR ||
        (currentHour === ON_TIME_HOUR && currentMinute > ON_TIME_MINUTE)
      ) {
        status = "LATE";
      } else {
        status = "ON_TIME";
      }

      message = `Absen Masuk Berhasil! Selamat datang, ${matchedUser.name}.`;
    } else if (!hasOut) {
      // Sudah ada IN hari ini -> Absen Pulang (OUT)
      // Cek jeda minimal 2 menit setelah IN agar tidak langsung checkout tidak sengaja
      const firstIn = todayAttendances.find((a) => a.type === "IN")!;
      const diffMinutes = (now.getTime() - new Date(firstIn.createdAt).getTime()) / (1000 * 60);

      if (diffMinutes < 2) {
        return res.status(400).json({
          success: false,
          message: `Anda baru saja absen Masuk ${Math.round(diffMinutes)} menit yang lalu. Belum dapat melakukan Absen Pulang.`,
          user: {
            id: matchedUser.id,
            name: matchedUser.name,
            memberCode: matchedUser.memberCode,
            department: matchedUser.department,
          },
        });
      }

      type = "OUT";
      status = "ON_TIME";
      message = `Absen Pulang Berhasil! Terima kasih atas kerja keras Anda hari ini, ${matchedUser.name}.`;
    } else {
      // Sudah lengkap IN dan OUT
      type = "OUT";
      status = "ON_TIME";
      message = `Pembaruan Absen Pulang Berhasil! Sampai jumpa, ${matchedUser.name}.`;
    }

    // Simpan ke database
    const newAttendance = await prisma.attendance.create({
      data: {
        userId: matchedUser.id,
        type,
        status,
        similarityDistance: minDistance,
        snapshotUrl: snapshotUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            memberCode: true,
            department: true,
            faceImageUrl: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message,
      data: newAttendance,
      matchedScore: (1 - minDistance) * 100, // perkiraan persentase kemiripan
    });
  } catch (error) {
    console.error("Scan attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}

/**
 * Mengambil ringkasan dan riwayat presensi hari ini untuk Portal Admin
 */
export async function getTodaySummary(req: Request, res: Response) {
  try {
    const { start, end } = getStartAndEndOfToday();

    const [totalMembers, todayLogs] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.attendance.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              memberCode: true,
              department: true,
              faceImageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Hitung statistik unik user yang hadir hari ini
    const presentUserIds = new Set<string>();
    let inCount = 0;
    let outCount = 0;
    let lateCount = 0;
    let onTimeCount = 0;

    for (const log of todayLogs) {
      presentUserIds.add(log.userId);
      if (log.type === "IN") {
        inCount++;
        if (log.status === "LATE") lateCount++;
        else onTimeCount++;
      } else if (log.type === "OUT") {
        outCount++;
      }
    }

    return res.json({
      success: true,
      stats: {
        totalMembers,
        presentToday: presentUserIds.size,
        inCount,
        outCount,
        lateCount,
        onTimeCount,
      },
      logs: todayLogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat rekap presensi hari ini.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}

/**
 * Riwayat presensi lengkap (dengan filter tanggal & pencarian)
 */
export async function getAttendanceHistory(req: Request, res: Response) {
  try {
    const { date, search, department } = req.query;

    const where: any = {};

    if (date && typeof date === "string") {
      const selectedDate = new Date(date);
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0);
      const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }

    if (search && typeof search === "string") {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { memberCode: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (department && typeof department === "string" && department !== "all") {
      where.user = {
        ...where.user,
        department: { equals: department, mode: "insensitive" },
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            memberCode: true,
            department: true,
            faceImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return res.json({
      success: true,
      data: attendances,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat riwayat presensi.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}

/**
 * Pendaftaran Anggota Baru oleh Admin (Nama + Foto Wajah + 128D Descriptor)
 */
export async function registerMemberByAdmin(req: Request, res: Response) {
  try {
    const { name, memberCode, department, email, faceDescriptor, faceImageUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama anggota wajib diisi.",
      });
    }

    if (!faceDescriptor || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({
        success: false,
        message: "Data biometrik wajah (128-dimensi) wajib dan harus valid.",
      });
    }

    // Validasi memberCode jika diisi
    if (memberCode && memberCode.trim()) {
      const existingCode = await prisma.user.findUnique({
        where: { memberCode: memberCode.trim() },
      });
      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: `Nomor ID/NIM/NIK ${memberCode} sudah terdaftar untuk pengguna lain.`,
        });
      }
    }

    // Validasi anti-duplikasi wajah
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        memberCode: true,
        faceDescriptor: true,
      },
    });

    const { matchedUser, minDistance } = findMatchingUser(
      faceDescriptor,
      allUsers,
      MATCH_THRESHOLD
    );

    if (matchedUser) {
      return res.status(409).json({
        success: false,
        message: `Wajah ini sudah terdaftar atas nama: ${matchedUser.name} (${matchedUser.memberCode || "Tanpa ID"}).`,
        similarityScore: minDistance,
      });
    }

    // Buat member baru
    const newMember = await prisma.user.create({
      data: {
        name: name.trim(),
        memberCode: memberCode ? memberCode.trim() : null,
        department: department ? department.trim() : null,
        email: email ? email.trim().toLowerCase() : null,
        role: "MEMBER",
        faceDescriptor,
        faceImageUrl: faceImageUrl || null,
      },
      select: {
        id: true,
        name: true,
        memberCode: true,
        department: true,
        email: true,
        faceImageUrl: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: `Anggota ${newMember.name} berhasil didaftarkan.`,
      data: newMember,
    });
  } catch (error) {
    console.error("Register member error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mendaftarkan anggota baru.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}

/**
 * Mendapatkan daftar seluruh anggota terdaftar
 */
export async function getMembers(req: Request, res: Response) {
  try {
    const members = await prisma.user.findMany({
      where: {
        role: "MEMBER",
      },
      select: {
        id: true,
        name: true,
        memberCode: true,
        department: true,
        email: true,
        faceImageUrl: true,
        createdAt: true,
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat daftar anggota.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}

/**
 * Menghapus anggota
 */
export async function deleteMember(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: `Anggota ${existing.name} berhasil dihapus.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus anggota.",
      error: error instanceof Error ? error.message : "Internal Error",
    });
  }
}
