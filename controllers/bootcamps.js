const path = require('path');
const Bootcamp = require('../models/bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // Get All
    const bootcamps = await Bootcamp.find().populate('courses');

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc    Get bootcamp by Id
// @route   GET /api/bootcamps/:id
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

    // if (!bootcamp) {
    //     return res.status(400).json({
    //         success: false
    //     });
    // }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Create new bootcamps
// @route   POST /api/bootcamps
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Update bootcamp by Id
// @route   PUT /api/bootcamps/:id
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        // Tham số để chạy xác thực Mongoose
        new: true,
        runValidators: true
    });

    // if (!bootcamp) {
    //     return res.status(400).json({
    //         success: false
    //     });
    // }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Delete bootcamp by Id
// @route   Delete /api/bootcamps/:id
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    console.log('vaof controller')
    // tìm bootcamp theo id
    const bootcamp = await Bootcamp.findById(req.params.id);

    // sử dụng phương thức remove() để kích hoạt MiddleWare
    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get bootcamp with city
// @route   GET /api/bootcamps/geography/:city/:street
exports.getBootcampsByGeography = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find({
        city: req.params.city,
        street: req.params.street
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc    Upload image for bootcamp
// @route   PUT /api/bootcamps/:id/photo
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    // tìm bootcamp theo id
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;
    // kiểm tra xem có phải là file ảnh không?
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image`, 400));
    }

    // kiểm tra dung lượng file ảnh
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image`, 400));
    }

    // custom tên ảnh theo id của bootcamp
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        // update photo for bootcamp
        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })
        
        bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    })
});
