const express = require("express");
const router = express.Router();
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getUserDashboardData,
  updateTaskCheckList,
  updateTaskStatus,
  getDashboardData,
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
} = require("../controllers/taskController");
router.get("/", protect, getTasks); // get all tasks {Admin: all , User : assigned}
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/dashboard-data", protect, getDashboardData);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskCheckList);

module.exports = router
