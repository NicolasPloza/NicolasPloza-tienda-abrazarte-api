import { Request, Response } from 'express';
import { OrderService, DatosCheckout } from '../services/order.service';

const orderService = new OrderService();

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || 'session-demo-123';
    const { nombreCliente, emailCliente, telefono, direccion, usuarioId } = req.body;

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
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
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