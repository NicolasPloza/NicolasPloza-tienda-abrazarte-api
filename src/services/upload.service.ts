// src/services/upload.service.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de las credenciales de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del motor de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tienda-artesanal/productos', // Carpeta destino en tu cuenta de Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

// Exportamos el middleware de Multer configurado
export const uploadMiddleware = multer({ storage });