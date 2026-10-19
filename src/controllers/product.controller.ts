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

// --- RUTAS ADMINISTRATIVAS ---

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try { 
        const { nombre, precio, stock, categoriaId } = req.body;

        if (!nombre || precio === undefined || stock === undefined || !categoriaId) {
            res.status(400).json({ success: false, message: 'Faltan campos obligatorios para el producto.' });
            return;
        }

        const nuevoProducto = await productService.crearProducto(req.body);
        res.status(201).json({ success: true, data: nuevoProducto });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el producto.' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const productoActualizado = await productService.actualizarProducto(id, req.body);
        res.status(200).json({ success: true, data: productoActualizado });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        await productService.eliminarProducto(id);
        res.status(200).json({ success: true, message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
    }
};

/**
 * POST /api/v1/products/upload-image
 * Controlador que procesa el archivo subido a Cloudinary y devuelve la URL generada
 */
export const uploadProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.file es provisto por el middleware de Multer tras subir la imagen a Cloudinary
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No se ha proporcionado ningún archivo de imagen.',
            });
            return;
        }

        // req.file.path contiene la URL pública HTTPS de Cloudinary
        const urlImagen = req.file.path;

        res.status(200).json({
            success: true,
            message: 'Imagen subida con éxito a Cloudinary.',
            data: { url: urlImagen },
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error interno al procesar la subida de la imagen.',
        });
    }
};