import { Resend } from 'resend';
import dotenv from 'dotenv';

// Importamos las plantillas HTML desde el nuevo módulo
import { generarHtmlCliente, generarHtmlAdministrador } from '../templates/email.template';

dotenv.config();

// Inicializamos la instancia de Resend con la clave de API del archivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  /**
   * Envía las notificaciones de compra al cliente y al administrador utilizando Resend
   */
  async enviarConfirmacionCompra(orden: any) {
    // 1. Enviar correo al cliente (bloque independiente)
    try {
      const respuestaCliente = await resend.emails.send({
        from: 'Tienda Artesanal <onboarding@resend.dev>',
        to: [orden.emailCliente],
        subject: `Confirmación de tu pedido #${orden.id} - Tienda Artesanal`,
        html: generarHtmlCliente(orden), // Usamos la plantilla importada
      });

      if (respuestaCliente.error) {
        console.error('No se pudo enviar el mail al cliente:', respuestaCliente.error.message);
        console.log('💡 Consejo: En modo prueba de Resend, solo puedes enviar mails a la dirección registrada en tu cuenta.');
      } else {
        console.log(`Mail enviado con éxito al cliente (${orden.emailCliente}) - ID: ${respuestaCliente.data?.id}`);
      }
    } catch (error) {
      console.error('Error grave al intentar enviar el correo al cliente:', error);
    }

    // 2. Enviar correo al administrador (bloque independiente)
    try {
      const respuestaAdmin = await resend.emails.send({
        from: 'Sistema de Ventas <onboarding@resend.dev>',
        to: [process.env.ADMIN_EMAIL || 'admin@tiendamatesycuadros.com'],
        subject: `🚨 [NUEVA VENTA] Orden #${orden.id} - $${Number(orden.total).toLocaleString('es-AR')}`,
        html: generarHtmlAdministrador(orden), // Usamos la plantilla importada
      });

      if (respuestaAdmin.error) {
        console.error('No se pudo enviar el mail al administrador:', respuestaAdmin.error.message);
      } else {
        console.log(`Mail enviado con éxito al administrador - ID: ${respuestaAdmin.data?.id}`);
      }
    } catch (error) {
      console.error('Error grave al intentar enviar el correo al administrador:', error);
    }
  }
}