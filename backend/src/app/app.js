import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productRoutes from "../routes/product.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

// authenticaton APIs
app.use("/api/auth", authRoutes)

// products APIs
app.use("/api/products", productRoutes)

export default app