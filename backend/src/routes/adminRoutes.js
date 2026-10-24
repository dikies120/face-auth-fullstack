const { Router } = require("express");
const {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getGlobalActivityLogs,
} = require("../controllers/adminController");

const router = Router();

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);
router.get("/logs", getGlobalActivityLogs);

module.exports = router;
