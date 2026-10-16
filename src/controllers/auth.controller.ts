import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

/**
 * POST /api/v1/auth/register
 * Registra un nuevo usuario
*/

export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const {nombre, email, password} = req.body;

        if(!nombre || !email || !password){
            res.status(400).json({
                success: false,
                message: 'Debe ingresar nombre, email y contraseña.',
            });
            return;
        }

        const resultado = await authService.registrarUsuario({nombre,email,password});

        res.status(201).json({
            success: true,
            message: 'Usuario registrado con éxito.',
            data: resultado,
        });
    }catch(error: any){
        if(error.message === 'EMAIL_YA_REGISTRADO'){
            res.status(400).json({
                success: false,
                message: 'Ya existe una cuenta con el correo electrónico ingresado.'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Error interno al registrar usuario.'
        });
    }
}

/**
 * POST /api/v1/auth/login
 * Inicia sesión de usuario
*/
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({
                success: false,
                message: 'Debe ingresar usuario y contraseña.'
            });
            return;
        }

        const resultado = await authService.iniciarSesion({email, password});

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso.',
            data: resultado,
        });
    }catch(error: any){
        if(error.message === 'CREDENCIALES_INVALIDAS'){
            res.status(400).json({
                success: false,
                message: 'Correo electrónico o contraseña incrrectos.'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Error interno al iniciar sesión.'
        });
    }
}