import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import {
  calculateEuclideanDistance,
  isValidFaceDescriptor,
  findMatchingUser,
} from "../utils/faceMatcher.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";
const MATCH_THRESHOLD = parseFloat(process.env.FACE_MATCH_THRESHOLD || "0.5");

export async function registerWithFace(req: Request, res: Response) {
  try {
    const { name, email, password, faceDescriptor, faceImageUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      });
    }

    if (!faceDescriptor || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({
        success: false,
        message: "Data embedding wajah tidak valid (vektor 128 dimensi diperlukan).",
      });
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar.",
      });
    }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
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
        message: `Wajah ini sudah terdaftar pada akun lain (${matchedUser.email}).`,
        similarityScore: minDistance,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        faceDescriptor,
        faceImageUrl: faceImageUrl || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        faceImageUrl: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registrasi dengan pengenalan wajah berhasil.",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat registrasi.",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function verifyFaceLogin(req: Request, res: Response) {
  try {
    const { email, faceDescriptor } = req.body;

    if (!faceDescriptor || !isValidFaceDescriptor(faceDescriptor)) {
      return res.status(400).json({
        success: false,
        message: "Data embedding wajah tidak valid.",
      });
    }

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Pengguna dengan email ini tidak ditemukan.",
        });
      }

      const storedDescriptor = user.faceDescriptor as number[];
      const distance = calculateEuclideanDistance(faceDescriptor, storedDescriptor);
      const isMatched = distance < MATCH_THRESHOLD;

      await prisma.faceLoginLog.create({
        data: {
          userId: user.id,
          distance,
          isMatched,
          ipAddress: req.ip || null,
        },
      });

      if (!isMatched) {
        return res.status(401).json({
          success: false,
          message: "Wajah tidak cocok dengan data terdaftar.",
          distance,
          threshold: MATCH_THRESHOLD,
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Verifikasi wajah berhasil.",
        distance,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          faceImageUrl: user.faceImageUrl,
        },
        token,
      });
    }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        faceDescriptor: true,
        faceImageUrl: true,
      },
    });

    const { matchedUser, minDistance } = findMatchingUser(
      faceDescriptor,
      allUsers,
      MATCH_THRESHOLD
    );

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Wajah tidak dikenali dalam sistem.",
        minDistance,
        threshold: MATCH_THRESHOLD,
      });
    }

    const fullUser = allUsers.find((u) => u.id === matchedUser.id);

    await prisma.faceLoginLog.create({
      data: {
        userId: matchedUser.id,
        distance: minDistance,
        isMatched: true,
        ipAddress: req.ip || null,
      },
    });

    const token = jwt.sign(
      { userId: matchedUser.id, email: matchedUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: `Selamat datang kembali, ${matchedUser.name}.`,
      distance: minDistance,
      user: {
        id: fullUser?.id,
        name: fullUser?.name,
        email: fullUser?.email,
        faceImageUrl: fullUser?.faceImageUrl,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat verifikasi wajah.",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        faceImageUrl: true,
        createdAt: true,
        loginLogs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}
