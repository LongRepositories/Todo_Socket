const express = require('express');

// Include router courses
const courseRouter = require('./courses');

// xác thực token
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// import các phương thức
const {
    getBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByGeography,
    getFields,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

// Chuyển đổi sang courseRouter
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, authorize('admin', 'user'), bootcampPhotoUpload);

// Cấu hình router cho các phương thức
// ('/') 
// nếu là GET => getBootcamps
// nếu là POST => createBootcamp
router.route('/')
    .get(getBootcamps)
    .post(protect, authorize('admin', 'user'), createBootcamp);

// Cấu hình router cho các phương thức
// ('/:id') 
// nếu là GET => getBootcampById
// nếu là POST => updateBootcamp
// nếu là DELETE => deleteBootcamp
router.route('/:id')
    .get(getBootcampById)
    .put(protect, authorize('admin', 'publisher'), updateBootcamp)
    .delete(protect, authorize('admin', 'user'), deleteBootcamp);

// Cấu hình router cho các phương thức
// ('/geography/:city/:street') 
// nếu là GET => getBootcampsByGeography
router.route('/geography/:city/:street')
    .get(getBootcampsByGeography);


module.exports = router;