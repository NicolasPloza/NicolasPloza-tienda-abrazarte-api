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
}