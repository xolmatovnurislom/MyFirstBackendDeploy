const mongoose = require("mongoose")
require("dotenv").config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.CONNECT_DB)
        console.log("Databaza muvafaqiyatli ulandi!");
    } catch (error) {
        console.log("Baza ulanmadi: " + error);
        process.exit(1)
    }
}

module.exports = connectDB