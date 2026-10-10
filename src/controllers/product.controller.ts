import {Request,Response} from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

/**
 * GET /api/v1/products
 * Devuelve la lista de productos del catálogo.
 */
export const getProducts = async (req: Request,res: Response): Promise<void> => {
    try{
        const categoriaId = req.query.categoriaId? Number(req.query.categoriaId): undefined;
        const productos = await productService.obtenerProductos(categoriaId);
        
        res.status(200).json({
            success: true,
            data: productos,
        });
    }catch(error){
        console.error('Error interno al obtener productos', error)
        res.status(500).json({
            success: false,
            message:'Error interno al consultar catalogo de productos',
        });
    }
};