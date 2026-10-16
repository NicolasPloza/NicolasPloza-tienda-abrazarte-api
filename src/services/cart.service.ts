import { prisma } from '../lib/prisma';

export interface IdentificadorCarrito {
  usuarioId?: number;
  sessionId?: string;
}

export class CartService {
  
    /**
    * Busca o crea un carrito de forma independiente para un usuario registrado o un invitado.
    */
    async obtenerOCrearCarrito(idInfo: IdentificadorCarrito) {
        const { usuarioId, sessionId } = idInfo;

        if (usuarioId == null && !sessionId) {
            throw new Error('SE_REQUIERE_IDENTIFICADOR_DE_CARRITO');
        }

        // 1. Buscar el carrito existente.
        const carritoExistente = await prisma.carrito.findFirst({
            where: usuarioId != null ? { usuarioId } : { sessionId },
            include: {
                items: {
                    include: {
                        producto: {
                            include: {
                                categoria: true,
                                fotos: true,
                            },
                        },
                    },
                },
            },
        });

        // 2. Si existe, devolverlo.
        if (carritoExistente) {
            return carritoExistente;
        }

        // 3. Si no existe, crear uno nuevo.
        return await prisma.carrito.create({
            data: {
                ...(usuarioId != null ? { usuarioId } : { sessionId }),
            },
            include: {
                items: {
                    include: {
                        producto: {
                            include: {
                                categoria: true,
                                fotos: true,
                            },
                        },
                    },
                },
            },
        });
    }
  /**
   * Agrega un producto al carrito único del usuario o invitado.
   */
    async agregarItem(idInfo: IdentificadorCarrito, productoId: number, cantidad: number) {
    // Verificar que el producto exista y tenga stock
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      throw new Error('PRODUCTO_NO_ENCONTRADO');
    }
    if (producto.stock < cantidad) {
      throw new Error('STOCK_INSUFICIENTE');
    }

    // Obtener el carrito exclusivo del usuario
    const carrito = await this.obtenerOCrearCarrito(idInfo);

    // Verificar si el producto ya estaba en su carrito
    const itemExistente = await prisma.itemCarrito.findFirst({
      where: { carritoId: carrito.id, productoId },
    });

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (producto.stock < nuevaCantidad) {
        throw new Error('STOCK_INSUFICIENTE');
      }

      return await prisma.itemCarrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: nuevaCantidad },
      });
    } else {
      return await prisma.itemCarrito.create({
        data: {
          carritoId: carrito.id,
          productoId,
          cantidad,
        },
      });
    }
  }

  /**
   * Elimina un ítem del carrito.
   */
  async eliminarItem(itemId: number) {
    return await prisma.itemCarrito.delete({
      where: { id: itemId },
    });
  }
}