import { Router } from 'express';
import { checkout, getAllOrdersAdmin, getMyOrders, updateOrderStatusAdmin } from '../controllers/order.controller';
import { autenticarToken, identificarUsuarioOpcional } from '../middlewares/auth.middlewares';
import { autorizarAdmin } from '../middlewares/admin.middlewares';

const router = Router();

// POST /api/v1/orders/checkout (Acepta compras de usuarios e invitados)
router.post('/checkout',identificarUsuarioOpcional, checkout);

//// POST /api/v1/orders/my-orders
router.get('/my-orders',autenticarToken,getMyOrders);


// Rutas privadas de Administración---------------------------

// GET /api/v1/orders/admin/all 
router.get('/admin/all', autenticarToken, autorizarAdmin, getAllOrdersAdmin);

// PATCH /api/v1/orders/admin/:id/status
router.patch('/admin/:id/status', autenticarToken, autorizarAdmin, updateOrderStatusAdmin);


export default router;