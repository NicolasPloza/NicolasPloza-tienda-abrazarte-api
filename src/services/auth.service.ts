import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtNative from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export interface DatosLogin {
  email: string;
  password: string;
}

export class AuthService {
    /**
   * Registra un nuevo usuario en la base de datos PostgreSQL
   */
    async registrarUsuario(datos: DatosRegistro){
        // 1. Verifica si el correo ya está registrado
        const usuarioExistente = await prisma.usuario.findUnique({
            where:{
                email: datos.email
            }
        });

        if(usuarioExistente){
            throw new Error('EMAIL_YA_REGISTRADO');
        }

        // 2. Encripta la contraseña con bcrypt (10 rondas de sal)
        const passwordHash = await bcrypt.hash(datos.password,10);

        // 3. Crea el usuario en PostgreSQL
        const nuevoUsuario = await prisma.usuario.create({
            data:{
                nombre: datos.nombre,
                email: datos.email,
                password: passwordHash,
            }
        });
        // 4. Generar Token JWT de autenticación
        const token =  this.generarToken(nuevoUsuario.id, nuevoUsuario.email);

        return {
            usuario:{
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
            },
            token,
        };
    }

    /**
   * Valida las credenciales de un usuario e inicia su sesión
   */
    async iniciarSesion(datos: DatosLogin){
        // 1. Buscar al usuario por correo
        const usuario = await prisma.usuario.findUnique({
            where:{email: datos.email}
        });
        
        if(!usuario){
            throw new Error('CREDENCIALES_INVALIDAS');
        }

        // 2. Comparar la contraseña ingresada con el hash guardado en PostgreSQL
        const passwordValida = await bcrypt.compare(datos.password, usuario.password);

        if(!passwordValida){
            throw new Error('CREDENCIALES_INVALIDAS');
        }

        // 3. Generar el Token JWT
        const token = this.generarToken(usuario.id, usuario.email);

        return {
            usuario:{
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
            token,
        };
    }

    private generarToken(usuarioId: number, email: string):string{
        return jwtNative.sign({id: usuarioId,email},JWT_SECRET as string,{
            expiresIn:'24h', // El token expira en 24 horas
        });
    } 
}