const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
// Router files
const rtBootcamp = require("./router/bootcamps");
const rtCourse = require("./router/courses");
const rtAuth = require("./router/auth");
const rtTask = require("./router/tasks");
// const logger = require('./middleware/logger')

// Load env
dotenv.config({ path: "./config/config.env" });

// Kết nối với database
connectDB();

const app = express();

// Cấu hình dữ liệu gửi lên dạng JSON
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// sử dụng logging middleware
// app.use(logger);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// set folder
app.use(express.static(path.join(__dirname, "public")));

// gắn kết với router
app.use(process.env.LINK_API_BOOTCAMPS, rtBootcamp);
app.use(process.env.LINK_API_COURSES, rtCourse);
app.use(process.env.LINK_API_AUTH, rtAuth);
app.use(process.env.LINK_API_TASKS, rtTask);

// Chạy errorHandler (phải đặt chạy sau api)
app.use(errorHandler);

// Khởi tạo server
const server = require("http").createServer(app);

server.listen(
  process.env.PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
  )
);

// server socket
const IO = require("socket.io")(server);
IO.on("connection", function (socket) {
  console.log("Client connected...", socket.id);
  // return message for client
  IO.to(socket.id).emit("connection", "Hello World from client");

  // register room
  socket.on("room", function (data) {
    console.log("Room: ", data);
    // join room
    socket.join(data.room);
  });

  socket.on("send", function (data) {
    console.log("Message", data);
    socket.to(data.room).emit("receive", data);
  });
});

// Xử lí nếu không đúng mật khẩu hoặc tên đăng nhập vào DB
process.on("unhandledRejection", (err, promise) => {
  console.log(`ERROR: ${err.message}`);
  // Nếu lỗi thì đóng server và thoái process
  server.close(() => process.exit(1));
});
