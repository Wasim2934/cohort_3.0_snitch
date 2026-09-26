import express from "express";
import { createProductValidator } from "../validators/product.validator.js";

import multer from "multer";
import { authenticate, authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, listAllProducts, listAllProductsToSeller } from "../controllers/product.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

const router = express.Router();

// method - post 
// route - /api/products
router.post("/", authenticate,
  (req, res, next) => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "user is not authorize to create products",
      });
    }
    next();
  },
  upload.array("images"),
  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
  },
  createProductValidator,
  createProduct,
);

// method - get
// route - /api/products
router.get("/", authenticate, listAllProducts)

// method - get
// route - /api/products/seller
router.get("/seller", authenticate, authenticateSeller, listAllProductsToSeller)

// method - patch
// route - /api/products/unlist/:id
router.patch("/unlist/:id", authenticate, authenticateSeller, )





export default router;
