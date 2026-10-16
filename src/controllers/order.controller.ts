import { Request, Response } from 'express';
import { OrderService} from '../services/order.service';
import { DatosCheckout } from '../types/interfaces';
import { EstadoOrden } from '@prisma/client';

const orderService = new OrderService();

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = (req.headers['x-session-id'] as string);
    const usuarioId = req.user?.id;
    const { nombreCliente, emailCliente, telefono, direccion} = req.body;

    // Validación de campos obligatorios para el envío
    if (!nombreCliente || !emailCliente || !telefono || !direccion) {
      res.status(400).json({
        success: false,
        message: 'Por favor complete todos los datos de contacto y envío.',
      });
      return;
    }

    const datos: DatosCheckout = {
      sessionId,
      nombreCliente,
      emailCliente,
      telefono,
      direccion,
      usuarioId: usuarioId,
    };

    const orden = await orderService.procesarCheckout(datos);

    // Si la compra fue realizada por un invitado, incluyo la invitación a registrarse
    const esInvitado = !datos.usuarioId;

    res.status(201).json({
      success: true,
      message: '¡Orden creada con éxito!',
      data: {
        orden,
        ...(esInvitado && {
            opcionRegistro: {
                ofrecerCrearCuenta: true,
                emailSugerido: orden.emailCliente,
                mensaje: '¿Deseas crear una contraseña para guardar tu historial de compras?',
            },
        }),
      },
    });
  } catch (error: any) {
        if (error.message === 'CARRITO_VACIO') {
            res.status(400).json({ success: false, message: 'El carrito está vacío.' });
            return;
        }
        if (error.message.startsWith('STOCK_INSUFICIENTE')) {
            res.status(400).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: 'Error interno al procesar el checkout.' });
    }
};

/**
 * GET /api/v1/orders/my-orders
 * Devuelve las compras realizadas por el usuario actualmente autenticado
 */
export const getMyOrders = async (req:Request, res:Response): Promise<void> => {
  try{
    const usuarioId = req.user?.id;

    if(!usuarioId){
      res.status(401).json({success: false, message:'Usuario no identificado.'});
      return;
    }

    const ordenes = await orderService.obtenerOrdenesPorUsuario(usuarioId);

    res.status(200).json({
      success: true,
      data: ordenes,
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al consultar el historial de compras.'
    });
  }
};


// --- CONTROLADORES DE ADMINISTRACIÓN ---

export const getAllOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const estado = req.query.estado as EstadoOrden | undefined;
      const ordenes = await orderService.obtenerTodasLasOrdenes(estado);
      res.status(200).json({ success: true, data: ordenes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al consultar las órdenes del sistema.' });
    }
};

export const updateOrderStatusAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const ordenId = Number(req.params.id);
      const { estado } = req.body;

      if (!estado || !Object.values(EstadoOrden).includes(estado)) {
        res.status(400).json({ success: false, message: 'Estado de orden no válido.' });
        return;
      }

      const ordenActualizada = await orderService.cambiarEstadoOrden(ordenId, estado);
      res.status(200).json({ success: true, data: ordenActualizada });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar el estado de la orden.' });
    }
};
