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
        console.error('Error interno al obtener productos', error);
        res.status(500).json({
            success: false,
            message:'Error interno al consultar catalogo de productos',
        });
    }
};


/**
 * GET /api/v1/products/:id
 * Devuelve el detalle de un producto específico según su ID.
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = Number(req.params.id);
        //valido el id ingresado por el usuario
        if(isNaN(id)){
            res.status(400).json({
                success: false,
                message:'El ID proporcionado debe ser un numero entero válido.',
            });
            return;
        }

        //busco el producto en la base de datos
        const producto = await productService.obtenerProductoPorId(id);

        //si no existe el producto devuelvo error 404 not found
        if(!producto){
            res.status(404).json({
                success: false,
                message:`No se encontro el producto con el ID:${id}`,
            });
            return;
        }

        //devuelvo el producto encontrado
        res.status(200).json({
            success: true,
            data: producto,
        });
    }catch(error){
        console.error('Error interno al obtener el producto', error);
        res.status(500).json({
            success: false,
            message:'Error interno al consultar catalogo de productos',
        });
    }
};