import express from "express"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { login, register } from "../controllers/auth.controller.js"



const router = express.Router()

router.post("/register", registerValidator ,register)
router.post("/login", loginValidator, login)



export default router 