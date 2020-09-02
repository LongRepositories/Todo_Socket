const mongoose = require('mongoose');

// Cấu hình kết nối với MongoDB
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;