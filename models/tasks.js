const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a task title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // tên export ra ở model
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    assign: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // tên export ra ở model
    },
  },
  {
    // Tạo ra để sử dụng populate
    // Kiểu dữ liệu khi populate sẽ là JSON
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Task", TaskSchema);
