import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productRoutes from "../routes/product.routes.js"
import cartRoutes from "../routes/cart.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

// authenticaton APIs
app.use("/api/auth", authRoutes)

// products APIs
app.use("/api/products", productRoutes)

// cart APIs
app.use("/api/cart", cartRoutes)

export default app