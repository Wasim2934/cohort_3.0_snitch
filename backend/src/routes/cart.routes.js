import { Router } from "express";
import { addToCartValidator } from "../validators/cart.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";


const router = Router();

// add to cart
router.post("/", authenticate, addToCartValidator, addToCart);

// get all cart products
router.get("/", authenticate, getCart);

export default router; 
