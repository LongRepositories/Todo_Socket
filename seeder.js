const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Seeder phục vụ cho việc import dữ liệu từ file vào DB

// Load các biến trong file config.env
dotenv.config({path:'./config/config.env'});

// Load các models
const Bootcamp = require('./models/bootcamps');
const Course = require('./models/courses');

// Kết nối DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Đọc file JSON 
// File chuẩn bị sẵn có tên là _data
// Bên trong file có chứa thông tin dưới dạng chuỗi JSON là bootcamps
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// Import dữ liệu vào DB
const importData = async() => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);

        console.log('Data imported...');
        // Thoát khỏi tiến trình
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// Delete dữ liệu từ DB (xoá hết dữ liệu)
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();

        console.log('Data deleted...');
        // Thoát khỏi tiến trình
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// Nếu là Import thì gọi hàm importData
// Nếu là Delete thì gọi hàm deleteData
// Chạy câu lệnh ở console
// node seeder -i hoặc node seeder -d
if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}