import { Router } from "express";
import { getProducts, getProductById } from "../controllers/product.controller";

const router = Router();

// GET /api/v1/products
router.get('/', getProducts);

//GET /api/v1/products/:id
router.get('/:id', getProductById);

export default router;