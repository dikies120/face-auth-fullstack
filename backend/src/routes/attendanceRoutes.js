const { Router } = require("express");
const {
  scanAttendance,
  getTodaySummary,
  getAttendanceHistory,
  registerMemberByAdmin,
  getMembers,
  deleteMember,
} = require("../controllers/attendanceController");

const router = Router();

router.post("/scan", scanAttendance);
router.get("/today", getTodaySummary);
router.get("/history", getAttendanceHistory);
router.post("/members", registerMemberByAdmin);
router.get("/members", getMembers);
router.delete("/members/:id", deleteMember);

module.exports = router;
