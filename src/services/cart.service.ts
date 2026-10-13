import { prisma } from "../lib/prisma";

export class CartService {
    /**
   * Busca un carrito por 'sessionId' o lo crea si no existe.
   */
    async obtenerOCrearCarrito(sessionId: string){
        let carrito = await prisma.carrito.findUnique({
            where: {sessionId},
            include:{
                items: {
                    include: {
                        producto: {
                            include: {categoria: true}
                        }
                    }
                }
            }
        });

        if(!carrito){
            carrito = await prisma.carrito.create({
                data: {sessionId},
                include: {
                    items: {
                        include: {
                            producto: {include: {categoria: true}}
                        }
                    }
                }
            });
        }

        return carrito;
    }

    /**
   * Agrega un producto al carrito o incrementa la cantidad si ya existe.
   */
    async agregarItem(sessionId:string, productoId:number, cantidad: number){
        //verifico que exista el producto
        const producto = await prisma.producto.findUnique({where:{id: productoId}});
        if(!producto){
            throw new Error('PRODUCTO_NO_ENCONTRADO');
        }

        //verifico que hay stock suficiente
        if(producto.stock < cantidad){
            throw new Error('STOCK_INSUFICIENTE');
        }

        //obtengo o creo el carrito del usuario
        const carrito = await obtenerOCrearCarritoHelper(sessionId);

        //verifico si el producto ya esta en el carrito y aumento la cantidad o creo uno nuevo
        const itemExistente = await prisma.itemCarrito.findFirst({where: {carritoId: carrito.id, productoId}});
        if(itemExistente){
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            //valido el stock
            if(producto.stock < nuevaCantidad){
                throw new Error('STOCK_INSUFICIENTE');
            }

            return await prisma.itemCarrito.update({
                where: {id: itemExistente.id},
                data: {cantidad: nuevaCantidad},
            });
        }else{
            return await prisma.itemCarrito.create({
                data:{carritoId: carrito.id, productoId,cantidad},
            });
        }
    }

   /**
   * Elimina un ítem específico del carrito.
   */
    async eliminarItem(itemId:number){
        return await prisma.itemCarrito.delete({
            where: {id: itemId},    
        });
    }
}


async function obtenerOCrearCarritoHelper(sessionId:string) {
    const cartService = new CartService();
    return await cartService.obtenerOCrearCarrito(sessionId);
}