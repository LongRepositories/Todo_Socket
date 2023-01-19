const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // không hiển thị mật khẩu
  },
  resetPasswordToken: String, // mã thông báo token khi quên pass
  resetPasswordExpire: Date, //đặt lại thời hẹn cho token khi quên pass
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// mã hoá mật khẩu với bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  //tạo salt cho mật khẩu
  //khuyên dùng sẽ là 10 vòng lặp trong getSalt
  //nếu số vòng lặp càng lớn thì càng an toàn nhưng nặng hệ thống
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// So sánh mật khẩu nhập vào và mật khẩu trong DB
// trả về true/false
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo và hash password với token
// Để phục vụ cho quên mật khẩu
UserSchema.methods.getResetPasswordToken = function () {
  // Tạo token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // set lại trường resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set thời gian hết hạn = 1ph
  this.resetPasswordExpire = Date.now() + 1 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
