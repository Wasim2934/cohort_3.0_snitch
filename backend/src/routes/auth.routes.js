import express from "express"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { getMe, login, refresh, register } from "../controllers/auth.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"



const router = express.Router()

// .../api/auth/register
router.post("/register", registerValidator, register)

// .../api/auth/login
router.post("/login", loginValidator, login)

// .../api/auth/refresh
router.post('/refresh', refresh)

// .../api/auth/me
router.get('/me', authenticate, getMe)


export default router 