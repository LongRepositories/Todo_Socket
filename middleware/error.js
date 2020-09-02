const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {    
    console.log('vaof error')
    // Xử lí lỗi với Mongoose
    let error = {...err};
    error.message = err.message;

    // Nếu là lỗi không tìm thấy Id
    // Thì trả về message và mã lỗi 404
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Nếu là lỗi dữ liệu bị trùng
    // Thì trả về message và mã lỗi 400
    if(err.name === 'MongoError'){
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Nếu là lỗi Validation
    // Thì trả về message và mã lỗi 400
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // Trả về lỗi cho Client
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;