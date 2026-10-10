import dotenv from 'dotenv';
import app from './app';

// Cargar variables de entorno del archivo .env
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar el servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🔍 Verifica el estado de la API en: http://localhost:${PORT}/health`);
});