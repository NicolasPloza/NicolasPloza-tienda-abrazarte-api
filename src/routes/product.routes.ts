import { Router } from "express";
import { getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    uploadProductImage} from "../controllers/product.controller";
import { autenticarToken } from "../middlewares/auth.middlewares";
import { autorizarAdmin } from "../middlewares/admin.middlewares";
import { uploadMiddleware } from "../services/upload.service";


const router = Router();

// GET /api/v1/products
router.get('/', getProducts);

//GET /api/v1/products/:id
router.get('/:id', getProductById);



// Rutas Protegidas (Solo Administradores pueden crear, editar o eliminar)

//POST /api/v1/products
router.post('/', autenticarToken, autorizarAdmin, createProduct);

//PUT /api/v1/products/:id
router.put('/:id', autenticarToken, autorizarAdmin, updateProduct);

//DELETE /api/v1/products/:id
router.delete('/:id', autenticarToken, autorizarAdmin, deleteProduct);

//POST /api/v1/products/upload-image
// Ruta para subir imagen: Protegida + Middleware Multer + Controlador dedicado
router.post(
  '/upload-image',
  autenticarToken,
  autorizarAdmin,
  uploadMiddleware.single('imagen'), // Procesa el campo 'imagen' del formulario (lib Multer)
  uploadProductImage 
);

export default router;