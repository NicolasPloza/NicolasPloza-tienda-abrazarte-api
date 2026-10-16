import { Router, Request, Response, NextFunction } from 'express';
import { getCart, addItem } from '../controllers/cart.controller';
import jwt from 'jsonwebtoken';
import { identificarUsuarioOpcional } from '../middlewares/auth.middlewares';

const router = Router();



// Aplicamos el identificador opcional a las rutas del carrito
router.get('/', identificarUsuarioOpcional, getCart);
router.post('/items', identificarUsuarioOpcional, addItem);

export default router;