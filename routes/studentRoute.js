const express = require("express")
const router = express.Router()
const studentController = require("../controllers/studentController")
const authMiddleware = require("../middleWares/authMiddleware")

router.get(
    "/students",
    authMiddleware, studentController.getStudents
)

router.get(
    "/students/profile",
    authMiddleware, studentController.profile
)

router.get(
    "/students/stats",
    studentController.getStats
)

router.post(
    "/students/send-otp",
    studentController.sendOTP
)

router.post(
    "/students/verify-otp",
    studentController.verifyOTP
)

router.post(
    "/students/register",
    studentController.registerStudent
)

router.post(
    "/students/login",
    studentController.loginStudent
)

router.put(
    "/students/:id",
    authMiddleware, studentController.updateStudent
)

router.delete(
    "/students/:id",
    authMiddleware, studentController.deletestudent
)

module.exports = router