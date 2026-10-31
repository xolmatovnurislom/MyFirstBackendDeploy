const z = require("zod")
const mongoose = require("mongoose")

const registerSchema = z.object({
    fullName: z.string().min(2),
    age: z.number().min(7),
    email: z.string().email().transform((email) => email.toLocaleLowerCase()),
    password: z.string().min(8),
    course: z.string().min(2),
    isActive: z.boolean().optional().default(false),
    teacher: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id))
})

const loginSchema = z.object({
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8) 
})

module.exports = { registerSchema, loginSchema }