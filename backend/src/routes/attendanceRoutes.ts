import { Router } from "express";
import {
  scanAttendance,
  getTodaySummary,
  getAttendanceHistory,
  registerMemberByAdmin,
  getMembers,
  deleteMember,
} from "../controllers/attendanceController.js";

const router = Router();

// Kiosk Face Scan
router.post("/scan", scanAttendance);

// Admin Dashboard & Reports
router.get("/today", getTodaySummary);
router.get("/history", getAttendanceHistory);

// Admin Member Management
router.post("/members", registerMemberByAdmin);
router.get("/members", getMembers);
router.delete("/members/:id", deleteMember);

export default router;
