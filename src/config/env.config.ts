import dotenv from 'dotenv';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Falta configurar la variable de entorno JWT_SECRET');
}

export const env = {
  JWT_SECRET: jwtSecret,
};