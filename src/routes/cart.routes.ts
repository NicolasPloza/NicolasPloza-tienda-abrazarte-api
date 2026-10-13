import { Router } from "express";
import { addItem, deleteItem, getCart } from "../controllers/cart.controller";

const router = Router();

//GET /api/v1/cart
router.get('/', getCart);

//POST /api/v1/cart/items
router.post('/items', addItem);

//DELETE /api/v1/cart/items/:id
router.delete('/items/:id', deleteItem);

export default router;