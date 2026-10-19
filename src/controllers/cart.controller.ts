import { Request, Response } from 'express';
import { CartService, IdentificadorCarrito } from '../services/cart.service';

const cartService = new CartService();

/**
 * Función auxiliar para obtener el identificador único del carrito.
 * Prioriza el ID del usuario autenticado (req.user) y, si no existe, usa el header 'x-session-id'.
 */
const obtenerIdentificadorCarrito = (req: Request): IdentificadorCarrito => {
    // Si el usuario inició sesión, usamos su ID de usuario autenticado
    if (req.user && req.user.id) {
        return { usuarioId: req.user.id };
    }

    // Si es un cliente invitado, leemos su ID de sesión único desde los encabezados
    const sessionId = (req.headers['x-session-id'] as string);
    return { sessionId };
};

/**
* GET /api/v1/cart
* Obtiene el carrito independiente del usuario actual
*/
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {   
        const idInfo = obtenerIdentificadorCarrito(req);
        const carrito = await cartService.obtenerOCrearCarrito(idInfo);

        const total = carrito.items.reduce((sum, item) => {
        return sum + Number(item.producto.precio) * item.cantidad;
        }, 0);

        res.status(200).json({
        success: true,
        data: {
            id: carrito.id,
            usuarioId: carrito.usuarioId,
            sessionId: carrito.sessionId,
            items: carrito.items,
            total,
        },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el carrito.' });
    }
};

/**
 * POST /api/v1/cart/items
 * Agrega un producto al carrito del usuario actual
 */
export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const idInfo = obtenerIdentificadorCarrito(req);
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad || cantidad <= 0) {
      res.status(400).json({
        success: false,
        message: 'Debe proporcionar productoId y cantidad válida.',
      });
      return;
    }

    const item = await cartService.agregarItem(idInfo, Number(productoId), Number(cantidad));

    res.status(201).json({
      success: true,
      message: 'Producto agregado al carrito con éxito.',
      data: item,
    });
  } catch (error: any) {
    if (error.message === 'PRODUCTO_NO_ENCONTRADO') {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }
    if (error.message === 'STOCK_INSUFICIENTE') {
      res.status(400).json({ success: false, message: 'Stock insuficiente.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al agregar ítem al carrito.' });
  }
};

/**
 * DELETE /api/v1/cart/items/:id
 * Elimina un producto del carrito del usuario actual
 */

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try{
    const itemId = Number(req.params.id);
    await cartService.eliminarItem(itemId);
    res.status(200).json({success: true, message:'Item eliminado correctamente.'});
  }catch(error){
    res.status(500).json({success: false, message: "Error al eliminar Item."});
  }
}; 