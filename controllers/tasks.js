const path = require("path");
const Task = require("../models/tasks");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = asyncHandler(async (req, res, next) => {
  // Get All
  const tasks = await Task.find().populate(["owner", "assign"]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get tasks by Id
// @route   GET /api/tasks/:id
exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate(["owner", "assign"]);

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create new bootcamps
// @route   POST /api/bootcamps
exports.createTask = asyncHandler(async (req, res, next) => {
  console.log("body", req.body);
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task by Id
// @route   PUT /api/task/:id
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    // Tham số để chạy xác thực Mongoose
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete bootcamp by Id
// @route   Delete /api/bootcamps/:id
exports.deleteTask = asyncHandler(async (req, res, next) => {
  // tìm bootcamp theo id
  const task = await Task.findById(req.params.id);

  // sử dụng phương thức remove() để kích hoạt MiddleWare
  task.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get tasks by user
// @route   GET /api/tasks/user/:userId
exports.getTasksByAssign = asyncHandler(async (req, res, next) => {
  console.log("req", req.params);
  const tasks = await Task.find({
    assign: req.params.userId,
  }).populate(["owner", "assign"]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});
