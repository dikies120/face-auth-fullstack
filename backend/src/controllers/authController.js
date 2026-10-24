const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/prisma");
const {
  calculateEuclideanDistance,
  isValidFaceDescriptor,
  findMatchingUser,
} = require("../utils/faceMatcher");

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";
const MATCH_THRESHOLD = parseFloat(process.env.FACE_MATCH_THRESHOLD || "0.5");

async function registerWithFace(req, res) {
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
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faceImageUrl: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registrasi akun berhasil.",
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

async function registerWithPassword(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan kata sandi wajib diisi.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Kata sandi minimal 6 karakter.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        faceDescriptor: [],
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Pendaftaran akun berhasil! Mengalihkan ke dasbor...",
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

async function verifyFaceLogin(req, res) {
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

      const storedDescriptor = user.faceDescriptor;
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
        { userId: user.id, email: user.email, role: user.role },
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
          role: user.role,
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
        role: true,
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
      { userId: matchedUser.id, email: matchedUser.email, role: fullUser?.role },
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
        role: fullUser?.role,
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

async function loginWithPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan kata sandi wajib diisi.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi tidak cocok.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi tidak cocok.",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: `Login berhasil! Selamat datang, ${user.name}.`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        faceImageUrl: user.faceImageUrl,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat login.",
      error: error instanceof Error ? error.message : "Internal error",
    });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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

module.exports = {
  registerWithFace,
  registerWithPassword,
  verifyFaceLogin,
  loginWithPassword,
  getMe,
};
