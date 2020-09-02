const Course = require('../models/courses');
const Bootcamp = require('../models/bootcamps');
const asyncHandler = require('../middleware/async');

// @desc    Get courses
// @route   GET /api/courses
// @route   GET /api/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    // Kiểm tra xem có tồn tại bootcampId không?
    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        }).populate({
            path: 'bootcamp', // bootcamp tên bên models.courses
            select: 'name description createdAt' // các trường lấy ra từ bootcamp
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp', // bootcamp tên bên models.courses
            select: 'name description createdAt' // các trường lấy ra từ bootcamp
        });
    }

    // Chạy lệnh query
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
});

// @desc    Get single courses
// @route   GET /api/courses
// @route   GET /api/courses:id
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    // nếu course không tồn tại thì trả về lỗi
    if (!course) {
        return next(
            new ErrorResponse(`No sourse with the id ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: course
    })
});

// @desc    Get Add course
// @route   POST /api/bootcamps/:bootcampId/courses
exports.addCourse = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        // lấy bootcampId trên req
        req.body.bootcamp = req.params.bootcampId;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        // nếu course không tồn tại thì trả về lỗi
        if (!bootcamp) {
            return next(
                new ErrorResponse(`No bootcamp with the id ${req.params.bootcampId}`),
                404
            );
        }
    } else if (req.body.bootcamp) {
        const bootcamp = await Bootcamp.findById(req.body.bootcamp);
        // nếu course không tồn tại thì trả về lỗi
        if (!bootcamp) {
            return next(
                new ErrorResponse(`No bootcamp with the id ${req.params.bootcampId}`),
                404
            );
        }
    }

    let course = await Course.create(req.body);

    course = await Course.findById(course._id).populate({
        path: 'bootcamp',
        select: 'name'
    })

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Update course by Id
// @route   PUT /api/course/:id
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`No course with the id ${req.params.id}`),
            404
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        // Tham số để chạy xác thực Mongoose
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Delete course by Id
// @route   DELETE /api/course/:id
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`No course with the id ${req.params.id}`),
            404
        );
    }
    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
