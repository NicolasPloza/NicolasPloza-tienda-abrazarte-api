import { prisma } from "../lib/prisma";
import { Producto } from "@prisma/client";
import { ProductoInput } from "../types/interfaces";

export class ProductService{
    /**
   * Obtiene todos los productos de la base de datos PostgreSQL.
   * Si se pasa 'categoriaId', filtra la lista por esa categoría.
   */
    async obtenerProductos(categoriaId?: number): Promise<Producto[]>{
        return await prisma.producto.findMany({
            where:{
                ...(categoriaId && {categoriaId}),
            },
            include: {
                categoria: true,
                fotos: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }    

    /**
   * Busca y obtiene un unico producto por su ID
   * Devuelve el producto o 'null' si no existe en la base de datos
   */
    async obtenerProductoPorId(id: number): Promise<Producto|null>{
        return await prisma.producto.findUnique({
            where: {id}, //esto es lo mismo que poner {id: id} uno es la prop y la otra es el param
            include: {
                categoria: true,
                fotos: true,
            },
        });
    }

    // --- MÉTODOS DE ADMINISTRACIÓN ---

  /**
   * Crea un nuevo producto junto con sus fotos asociadas.
   */
  async crearProducto(datos: ProductoInput) {
    const { fotos, ...datosProducto } = datos;

    return await prisma.producto.create({
      data: {
        ...datosProducto,
        fotos: fotos && fotos.length > 0 ? {
          create: fotos.map((f, index) => ({
            url: f.url,
            orden: f.orden ?? index,
            esPrincipal: f.esPrincipal ?? (index === 0),
          })),
        } : undefined,
      },
      include: {
        categoria: true,
        fotos: { orderBy: { orden: 'asc' } },
      },
    });
  }

    /**
     * Actualiza un producto existente y reemplaza sus fotos si se envían nuevas.
     */
    async actualizarProducto(id: number, datos: Partial<ProductoInput>) {
        const { fotos, ...datosProducto } = datos;

        return await prisma.$transaction(async (tx) => {
            if (fotos) {
                await tx.fotoProducto.deleteMany({ where: { productoId: id } });
                await tx.fotoProducto.createMany({
                    data: fotos.map((f, index) => ({
                        productoId: id,
                        url: f.url,
                        orden: f.orden ?? index,
                        esPrincipal: f.esPrincipal ?? (index === 0),
                    })),
                });
            }

            return await tx.producto.update({
                where: { id },
                data: datosProducto,
                include: {
                categoria: true,
                fotos: { orderBy: { orden: 'asc' } },
                },
            });
        });
    }

    /**
     * Elimina un producto de la base de datos por su ID.
     */
    async eliminarProducto(id: number) {
        return await prisma.producto.delete({
            where: { id },
        });
    }
}