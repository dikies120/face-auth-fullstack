const { Router } = require("express");
const {
  registerWithFace,
  registerWithPassword,
  verifyFaceLogin,
  loginWithPassword,
  getMe,
} = require("../controllers/authController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/register", registerWithPassword);
router.post("/register-password", registerWithPassword);
router.post("/register-face", registerWithFace);
router.post("/verify-face", verifyFaceLogin);
router.post("/login-password", loginWithPassword);
router.get("/me", authenticateJWT, getMe);

module.exports = router;
