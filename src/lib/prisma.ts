import { PrismaClient }  from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 1. Creamos un pool de conexiones con PostgreSQL usando el paquete 'pg'
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 2. Creamos el adaptador de Prisma para PostgreSQL
const adapter = new PrismaPg(pool);

// Instanciamos el cliente de Prisma para interactuar con PostgreSQL
export const prisma = new PrismaClient({adapter});