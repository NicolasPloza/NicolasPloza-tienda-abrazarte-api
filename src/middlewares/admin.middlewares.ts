import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

/**
 * Middleware que verifica que el usuario autenticado tenga el rol ADMINISTRADOR
 */
export const autorizarAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
      return;
    }

    // Consultamos el rol del usuario en PostgreSQL
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { rol: true },
    });

    if (!usuario || usuario.rol !== 'ADMINISTRADOR') {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador.',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al verificar permisos de administrador.' });
  }
};