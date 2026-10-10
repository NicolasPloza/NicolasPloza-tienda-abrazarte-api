import { prisma } from "../lib/prisma";
import { Producto } from "@prisma/client";

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
}