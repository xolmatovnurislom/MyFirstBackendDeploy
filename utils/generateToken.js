const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateToken = (teacher) => {
    return jwt.sign(
    {
        id: teacher._id,
        fullName: teacher.fullName
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
)
}

module.exports = generateToken