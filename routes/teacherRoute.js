const express = require("express")
const router = express.Router()
const teacherController = require("../controllers/teacherController")
const authMiddleware = require("../middleWares/authMiddleware")

router.get(
    "/teachers",
    teacherController.getTeachers
)

router.get(
    "/teachers/profile",
    authMiddleware, teacherController.profile
)

router.post(
    "/teachers/send-otp",
    teacherController.sendOTP
)

router.post(
    "/teachers/verify-otp",
    teacherController.verifyOTP
)

router.post(
    "/teachers/register",
    teacherController.registerTeacher
)

router.post(
    "/teachers/login",
    teacherController.loginTeacher
)

router.put(
    "/teachers/:id",
    authMiddleware, teacherController.updateTeacher
)

router.delete(
    "/teachers/:id",
    authMiddleware, teacherController.deleteTeacher
)

module.exports = router