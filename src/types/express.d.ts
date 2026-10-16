import { Request } from 'express';

// Extendemos la definición global de Express para permitir asociar los datos del usuario autenticado a la petición HTTP
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
