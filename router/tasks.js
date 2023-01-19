const express = require("express");

// xác thực token
const { protect } = require("../middleware/auth");

// mergeParams: để hợp nhất các tham số
const router = express.Router({ mergeParams: true });

// import các phương thức
const {
  getTasks,
  createTask,
  getTasksByAssign,
  getTaskById,
} = require("../controllers/tasks");

// Cấu hình router cho các phương thức
// ('/')
// nếu là GET => getTasks
router.route("/").get(getTasks).post(protect, createTask);
router.route("/:userId").get(protect, getTasksByAssign);
router.route("/:id").get(protect, getTaskById);

module.exports = router;
