const Student = require("../models/student")
const { registerSchema, loginSchema } = require("../validators/studentValidator") 
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generateToken")
const transporter = require("../config/mail")
const teacher = require("../models/teacher")

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("teacher", "fullName email").select("-password")
        res.status(200).json(students)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.profile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)

        if (!student) {
            return res.status(404).json({
                message: "Bunday o'quvchi topilmadi!"
            })
        }

        res.status(200).json(student)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getStats = async (req, res) => {
    try {
        const stats = await Student.aggregate([
            {$group:{
                _id: "$course",
                tatalStudent: {$sum: 1}
            }}
        ])

        res.status(200).json(stats)

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.registerStudent = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "O'quvchi registratsiyadan o'tmadi!"
            })
        }

        const {fullName, age, email, password, course, isActive, teacher} = validation.data

        const existingStudent = await Student.findOne({email})

        if (existingStudent) {
            return res.status(400).json({
                message: "Bu email oldin ro'yxatdan o'tilgan!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newStudent = await Student.create({
            fullName, age, email, course, isActive, teacher, password: hashedPassword
        })

        res.status(201).json({
            message: "O'quvchi ro'yxatdan o'tdi!",
            student: newStudent
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.loginStudent = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "valiatsiyadan o'tmadi!"
            })
        }

        const {email, password} = validation.data

        const foundStudent = await Student.findOne({email})

        if (!foundStudent) {
            return res.status(404).json({
                message: "Bu email bo'yicha o'quvchi topilmadi!"
            })
        }

        const isMatch = await bcrypt.compare(password, foundStudent.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Parol noto'g'ri"
            })
        }

        const token = generateToken(foundStudent)

        res.status(200).json({
            message: "O'quvchi login qilindi!",
            token: token
            //test uchun
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )

        if (!student) {
            return res.status(404).json({
                message: "Bunday o'quvchi topilmadi!"
            })
        }

        res.status(200).json({
            message: "O'quvchi ma'lumotlari yangilandi!",
            student: student
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deletestudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id)

        if (!student) {
            return res.status(404).json({
                message: "Bunday o'quvchi topilmadi!"
            })
        }

        res.status(200).json({
            message: "O'quvchi o'chirildi!"
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