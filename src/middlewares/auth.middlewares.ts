import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {env} from '../config/env.config'


const JWT_SECRET = env.JWT_SECRET;

/**
 * Middleware para validar el Token JWT en rutas protegidas
 */
export const autenticarToken = (req: Request, res: Response, next: NextFunction): void => {

    const authHeader = req.headers['authorization'];
    
    // Extrae el token separando la palabra 'Bearer' del código
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no se envió ningún token, denegar el acceso inmediatamente
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Acceso denegado. No se proporcionó un token de autenticación.',
        });
        return;
    }

    try {
        // 3. Verifico la validez del token con el SECRET
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

        // 4. Adjunto los datos del usuario extraídos a la solicitud HTTP (req.user)
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        // 5. Permitir que la petición continúe hacia el siguiente controlador
        next();
    } catch (error) {
        // Si el token expiró o fue alterado
        res.status(401).json({
            success: false,
            message: 'Token de autenticación inválido o expirado.',
        });
    }
};

/**
 * Middleware Opcional: Si el usuario envía un token JWT en el header Authorization,
 * lo decodifica y guarda en req.user. Si no envía token, deja continuar como invitado.
 */
export const identificarUsuarioOpcional = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
      };
      req.user = { id: decoded.id, email: decoded.email };
    } catch (error) {
      // Si el token es inválido, simplemente ignora la autenticación y continúa como invitado
    }
  }
  next();
};