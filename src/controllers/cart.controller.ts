import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

/**
 * Obtiene el sessionId del header Http 'x-sesion-id'.
 */
const getSessionId = (req: Request): string => {
    return (req.headers['x-session-id'] as string) || 'session-demo-123';
}

/**
 * GET /api/v1/cart
 * Obtiene el contenido completo del carrito.
 */

export const getCart = async (req: Request, res: Response): Promise<void> =>{
    try{
        const sessionId = getSessionId(req);
        const carrito = await cartService.obtenerOCrearCarrito(sessionId);

        //calculo el total del carrito
        const total = carrito.items.reduce((sum, item) => {
            return sum + Number(item.producto.precio)* item.cantidad;
        },0);

        res.status(200).json({
            success: true,
            data:{
                id: carrito.id,
                sessionId: carrito.sessionId,
                items: carrito.items,
                total,
            }
        });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Error al consultar el carrito.' });
    }
};

/**
 * POST /api/v1/cart/items
 * Agrega un producto al carrito.
 */
export const addItem = async (req: Request, res: Response): Promise<void> =>{
    try{
        const sessionId = getSessionId(req);
        const {productoId, cantidad} = req.body;

        if(!productoId || !cantidad || cantidad <= 0){
            res.status(400).json({
                success: false,
                message: 'Debe proporcionar un productoId y una cantidad mayor a 0.'
            });
            return;
        }

        const item = await cartService.agregarItem(sessionId, Number(productoId),Number(cantidad));

        res.status(200).json({
            success: true,
            message: 'Producto agregado al carrito con exito.',
            data: item,
        });
    }catch(error: any){
        if(error.message === 'PRODUCTO_NO_ENCONTRADO'){
            res.status(404).json({
                success: false,
                message: 'El producto no existe.',      
            });
            return;        
        }
        if(error.message === 'STOCK_INSUFICIENTE'){
            res.status(400).json({
                success: false,
                message: 'No hay stock suficiente para la cantidad seleccionada.',
            });
            return;    
        }

        res.status(500).json({
            success: false,
            message: 'Error al agregar item al carrito.'
        });
        
    }
};

/**
 * DELETE /api/v1/cart/items/:id
 * Elimina un ítem del carrito por su ID de ítem.
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> =>{
    try{
        const itemId = Number(req.params.id);
        await cartService.eliminarItem(itemId);

        res.status(200).json({
            success: true,
            message: 'Item eliminado del carrito con exito.',
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el item del carrito',
        });
    }
}