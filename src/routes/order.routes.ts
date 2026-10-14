import { Router } from 'express';
import { checkout } from '../controllers/order.controller';

const router = Router();

// POST /api/v1/orders/checkout (Acepta compras de usuarios e invitados)
router.post('/checkout', checkout);

export default router;