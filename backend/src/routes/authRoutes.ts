import { Router } from "express";
import {
  registerWithFace,
  verifyFaceLogin,
  getMe,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register-face", registerWithFace);
router.post("/verify-face", verifyFaceLogin);
router.get("/me", authenticateJWT, getMe);

export default router;
