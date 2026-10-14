import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes'
import authRoutes from './routes/auth.routes'
import dotenv from 'dotenv';

const app: Application = express();

//variables de entorno
dotenv.config();
const BASE_URL = process.env.BASE_URL;


// Middlewares Globales
app.use(cors()); // Habilita peticiones desde otros dominios
app.use(express.json()); // Permite a Express entender datos en formato JSON en el cuerpo de las peticiones (req.body)

// Endpoint de prueba / comprobación de salud de la API (Healthcheck)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API de Tienda Artesanal en ejecución correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API (v1)
app.use(`${BASE_URL}/products`, productRoutes);
app.use(`${BASE_URL}/cart`, cartRoutes);
app.use(`${BASE_URL}/orders`, orderRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);

export default app;