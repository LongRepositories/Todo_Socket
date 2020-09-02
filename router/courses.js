const express = require('express');

// xác thực token
const { protect } = require('../middleware/auth');

// mergeParams: để hợp nhất các tham số
const router = express.Router({ mergeParams: true });

// import các phương thức
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

// Cấu hình router cho các phương thức
// ('/') 
// nếu là GET => getCourses
router.route('/')
    .get(getCourses)
    .post(protect, addCourse);

// Cấu hình router cho các phương thức
// ('/:id') 
// nếu là GET => getCourse
router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;