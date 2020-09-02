const mongoose = require('mongoose');
const slugify = require('slugify');
// const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be than 50 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid Url with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [11, 'Phone number can not be longer 11 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    location: {
        // GeoJSON point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    careers: {
        // Array of String
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // tên export ra ở model
        required: true
    }
},
    {
        // Tạo ra để sử dụng populate
        // Kiểu dữ liệu khi populate sẽ là JSON
        toJSON: { virtuals: true }
    }
);

// Khi chạy MiddleWare mới chạy được vào hàm này
// Tạo hàm chạy trước khi dữ liệu được lưu vào DB
// Chỉ sử dụng khi thêm dữ liệu
BootcampSchema.pre('save', function (next) {
    // Log ra thông tin các trường được thêm vào DB
    // console.log('Slugify ran', this.name, this.description);
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Lấy các course của bootcamp
// courses: tạo biến ảo để gọi lại bên controller
BootcampSchema.virtual('courses', {
    ref: 'Course', // Tên models exports ra
    localField: '_id',
    foreignField: 'bootcamp', // Khoá bên courses models
});

// Khi chạy MiddleWare mới chạy được vào hàm này
// Thực hiện xoá 1 bootcamp
// Thì sẽ xoá các course của bootcamp đó
BootcampSchema.pre('remove', async function (next) {
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});


module.exports = mongoose.model('Bootcamp', BootcampSchema);