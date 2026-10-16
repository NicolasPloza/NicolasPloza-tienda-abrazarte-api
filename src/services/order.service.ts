import { EstadoOrden } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { DatosCheckout } from '../types/interfaces';
import { EmailService } from './email.service';

const emailService = new EmailService();


export class OrderService {
    /**
     * Procesa la compra tanto para usuarios registrados como para invitados
     */
    async procesarCheckout(datos: DatosCheckout) {
        // 1. Obtener el carrito de compras asociado a la sesión
        const carrito = await prisma.carrito.findUnique({
            where: datos.usuarioId? { usuarioId: datos.usuarioId } : { sessionId: datos.sessionId },
            include: {
                items: {
                    include: { producto: true },
                },
            },
        });

        if (!carrito || carrito.items.length === 0) {
            throw new Error('CARRITO_VACIO');
        }

        // 2. Validar que haya stock suficiente para cada producto
        for (const item of carrito.items) {
            if (item.producto.stock < item.cantidad) {
                throw new Error(`STOCK_INSUFICIENTE_${item.producto.nombre}`);
            }
        }

        // 3. Calcular el monto total de la orden
        const total = carrito.items.reduce((sum, item) => {
            return sum + Number(item.producto.precio) * item.cantidad;
        }, 0);

        // 4. Transacción atómica en PostgreSQL con Prisma
        const ordenCreada = await prisma.$transaction(async (tx) => {
            // a. Crear la orden asociando el usuarioId solo si existe
            const nuevaOrden = await tx.orden.create({
                data: {
                    nombreCliente: datos.nombreCliente,
                    emailCliente: datos.emailCliente,
                    telefono: datos.telefono,
                    direccion: datos.direccion,
                    total,
                    usuarioId: datos.usuarioId ? datos.usuarioId : null, // Asocia el usuario registrado si está presente
                    items: {
                        create: carrito.items.map((item) => ({
                            productoId: item.productoId,
                            cantidad: item.cantidad,
                            precioUnitario: item.producto.precio,
                        })),
                    },
                },
                include: {
                    items: {
                        include: { producto: true },
                    },
                },
            });

            // b. Descontar el stock de cada producto comprado
            for (const item of carrito.items) {
                await tx.producto.update({
                where: { id: item.productoId },
                data: {
                    stock: { decrement: item.cantidad },
                },
                });
            }

            // c. Vaciar el carrito de la sesión
            await tx.itemCarrito.deleteMany({
                where: { carritoId: carrito.id },
            });

            return nuevaOrden;
        });

        // 5. Enviar las notificaciones por correo electrónico con Resend
        emailService.enviarConfirmacionCompra(ordenCreada);

        return ordenCreada;
    }

    /**
    * Obtiene el historial de órdenes pertenecientes a un usuario registrado
    */
    async obtenerOrdenesPorUsuario(usuarioId: number) {
        return await prisma.orden.findMany({
            where:{usuarioId},
            include:{
                items:{
                    include:{producto:true}
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }


    // ------ MÉTODOS DE ADMINISTRACIÓN -------

    /**
    * Obtiene todas las órdenes del sistema con filtro opcional por estado.
    */
    async obtenerTodasLasOrdenes(estado?: EstadoOrden) {
        return await prisma.orden.findMany({
            where: estado ? { estado } : undefined,
            include: {
                items: { include: { producto: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Cambia el estado operativo de una orden.
     */
    async cambiarEstadoOrden(ordenId: number, nuevoEstado: EstadoOrden) {
        return await prisma.orden.update({
            where: { id: ordenId },
            data: { estado: nuevoEstado },
            include: {
                items: { include: { producto: true } },
            },
        });
    }

}