const jwt = require("jsonwebtoken")
require("dotenv").config()

const authMiddleware = (req, res, next) => {
    const authHeaders = req.headers.authorization

    if (!authHeaders) {
        return res.status(401).json({
            message: "token mavjut emas!"
        })
    }

    const token = authHeaders.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.token = decoded

        next()
    } catch (error) {
        res.status(401).json({
            message: "Token noto'g'ri yoki muddati tugagan!"
        })
    }
}

module.exports = authMiddleware