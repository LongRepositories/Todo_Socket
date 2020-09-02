const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/users');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    //Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    // check for user
    // findOne tìm kiếm theo email + với password
    const user = await User.findOne({ email }).select('+password');
    console.log("user", user);
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Kiểm tra quyền của user
    if (user.role !== 'admin') {
        return next(new ErrorResponse('Not authorize', 401));
    }

    // kiểm tra password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// Lấy token từ model, tạo cookie và gửi phản hồi
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        })
};

// @desc    Get current logged in user
// @route   POST /api/auth/me
exports.getCurrentUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200)
        .json({
            success: true,
            date: user
        })
})

// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new ErrorResponse('Not User', 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        data: user
    })
})