const nodemailer = require("nodemailer")
require("dotenv").config()
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "xolmatovnurislomdev@gmail.com",
        pass: process.env.APP_PASSWORD
    }
})

module.exports = transporter