const Teacher = require("../models/teacher")
const { registerSchema, loginSchema } = require("../validators/teacherValidator")
const generateToken = require("../utils/generateToken")
const bcrypt = require("bcrypt")
const transporter = require("../config/mail")

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select("-password")

        res.status(200).json(teachers)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.profile = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)

        if (!teacher) {
            return res.status(404).json({
                message: "Bunday o'qituvchi topilmadi!"
            })
        }

        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.registerTeacher = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "Registeratsiyadan o'tmadi!"
            })
        }

        const {fullName, email, password, subject, phone} = validation.data

        const existingTeacher = await Teacher.findOne({email})

        if (existingTeacher) {
            return res.status(400).json({
                message: "Bunday foydalanuvchi oldin ro'yxatdan o'tgan!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newTeacher = await Teacher.create({
            fullName, email, subject, phone, password: hashedPassword
        })

        res.status(201).json({
            message: "O'qituvchi ro'yxatdan o'tdi!",
            teacher: newTeacher
        })
  
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.loginTeacher = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "Login qilinmadi!"
            })
        }

        const {email, password} = validation.data

        const foundTeacher = await Teacher.findOne({email})

        if (!foundTeacher) {
            return res.status(404).json({
                message: "Bunday o'qituvchi emaili topilmadi!"
            })
        }

        const isMatch = await bcrypt.compare(password, foundTeacher.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Parol noto'g'ri!"
            })
        }

        const token = generateToken(foundTeacher)   

        res.status(200).json({
            message: "O'qituvchi login qilindi!",
            token: token
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )

        if (!teacher) {
            return res.status(404).json({
                message: "Bunday o'qituvchi topilmadi!"
            })
        }

        res.status(200).json({
            message: "O'qituvchi ma'lumotlari yangilandi!",
            teacher: teacher
        })
    } catch (error) {
        res.status(500).send(error)
    }
    
}

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id)

        if (!teacher) {
            return res.status(404).json({
                message: "O'qituvchi topilmadi!"
            })
        }

        res.status(200).json({
            message: "O'qituvchi o'chirildi!"
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

const otpStore = {}
exports.sendOTP = async (req, res) => {
    try {
        const {email} = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email kiriting!"
            })
        }

        const otp = Math.floor( 100000 + Math.random() * 900000 )

        otpStore[email] = otp

        await transporter.sendMail({
            from: "xolmatovnurislomdev@gmail.com",
            to: email,
            subject: "OTP code",
            text: `Sizning tasdiqlash kodingiz: ${otp}`
        })

        res.status(200).json({
            message: "OTP yuborildi!",
            otp: otp
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const {email, otp} = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: "email va otp kiriting!"
            })
        }

        if (otpStore[email] == otp) {
            delete otpStore[email]

            return res.status(200).json({
                message: "Otp kod tasdiqlandi!"
            })
        }

        res.status(400).json({
            message: "otp xato!"
        })
    } catch (error) {
        res.status(500).send(error)
    }
}