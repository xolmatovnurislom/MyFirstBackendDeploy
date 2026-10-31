const z = require("zod")

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8),
    subject: z.string().min(4),
    phone: z.string().min(12)
})

const loginSchema = z.object({
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8)
})

module.exports = { registerSchema, loginSchema }