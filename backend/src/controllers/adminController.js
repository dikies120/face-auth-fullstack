const { prisma } = require("../config/prisma");

function getStartAndEndOfToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

async function getPlatformStats(_req, res) {
  try {
    const { start, end } = getStartAndEndOfToday();

    const [totalUsers, totalAttendances, todayAttendances, totalFaceLogins] = await Promise.all([
      prisma.user.count(),
      prisma.attendance.count(),
      prisma.attendance.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      }),
      prisma.faceLoginLog.count(),
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalAttendances,
        todayAttendances,
        totalFaceLogins,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat statistik platform.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const { search, role } = req.query;

    const where = {};

    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { memberCode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && typeof role === "string" && role !== "ALL") {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        memberCode: true,
        department: true,
        role: true,
        faceImageUrl: true,
        createdAt: true,
        _count: {
          select: {
            attendances: true,
            loginLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat daftar pengguna.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Akun pengguna tidak ditemukan.",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: `Akun ${existing.name} (${existing.email || existing.memberCode || id}) berhasil dihapus.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus pengguna.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["ADMIN", "USER", "MEMBER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Peran pengguna tidak valid.",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.json({
      success: true,
      message: `Peran pengguna ${updated.name} berhasil diubah ke ${updated.role}.`,
      user: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui peran pengguna.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

async function getGlobalActivityLogs(_req, res) {
  try {
    const logs = await prisma.attendance.findMany({
      take: 60,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            memberCode: true,
            department: true,
            faceImageUrl: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memuat log aktivitas global.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

module.exports = {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getGlobalActivityLogs,
};
