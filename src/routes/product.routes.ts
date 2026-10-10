import { Router } from "express";
import { getProducts } from "../controllers/product.controller";

const router = Router();

// GET /api/v1/products
router.get('/', getProducts);

export default router;