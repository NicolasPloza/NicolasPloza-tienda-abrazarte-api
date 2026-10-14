// ===================================================
// PLANTILLA HTML PARA EL CLIENTE
// ===================================================
export function generarHtmlCliente(orden: any): string {
  const filasProductos = orden.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 14px; color: #2c2c2c;">
          <strong>${item.producto.nombre}</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 14px; color: #666666; text-align: center;">
          ${item.cantidad}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 14px; color: #2c2c2c; text-align: right; font-weight: bold;">
          $${Number(item.precioUnitario).toLocaleString('es-AR')}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Compra</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              
              <!-- Encabezado -->
              <tr>
                <td style="background-color: #18181b; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                    Tienda Artesanal
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #a1a1aa; letter-spacing: 1px;">
                    MATES & CUADROS
                  </p>
                </td>
              </tr>

              <!-- Cuerpo Principal -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 600; color: #18181b;">
                    ¡Gracias por tu compra, ${orden.nombreCliente}!
                  </h2>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; color: #52525b;">
                    Hemos recibido correctamente tu pedido <strong>#${orden.id}</strong>. Ya nos encontramos preparando tus piezas artesanales con el máximo cuidado.
                  </p>

                  <!-- Detalle de Productos -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                    <thead>
                      <tr>
                        <th align="left" style="padding-bottom: 8px; border-bottom: 2px solid #18181b; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase;">Producto</th>
                        <th align="center" style="padding-bottom: 8px; border-bottom: 2px solid #18181b; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase;">Cant.</th>
                        <th align="right" style="padding-bottom: 8px; border-bottom: 2px solid #18181b; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase;">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasProductos}
                    </tbody>
                  </table>

                  <!-- Total -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="right" style="font-size: 16px; color: #18181b;">
                        Total Abonado: <strong style="font-size: 20px; font-weight: 700; color: #18181b;">$${Number(orden.total).toLocaleString('es-AR')}</strong>
                      </td>
                    </tr>
                  </table>

                  <!-- Información de Envío -->
                  <div style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Dirección de Entrega</h3>
                    <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #27272a;">
                      ${orden.direccion}<br>
                      <strong>Teléfono de contacto:</strong> ${orden.telefono}
                    </p>
                  </div>

                  <!-- Banner de Registro para Invitados -->
                  ${
                    !orden.usuarioId
                      ? `
                    <div style="border-left: 3px solid #18181b; padding-left: 16px; margin-top: 24px;">
                      <p style="margin: 0; font-size: 13px; color: #52525b; line-height: 1.4;">
                        <strong>¿Quieres seguir tu pedido fácilmente?</strong><br>
                        Puedes crearte una cuenta en nuestra tienda utilizando tu correo (<code>${orden.emailCliente}</code>) para acceder a tu historial de compras.
                      </p>
                    </div>
                  `
                      : ''
                  }
                </td>
              </tr>

              <!-- Pie de página -->
              <tr>
                <td style="background-color: #fafafa; padding: 20px 40px; text-align: center; border-top: 1px solid #f4f4f5;">
                  <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                    © ${new Date().getFullYear()} Tienda Artesanal. Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ===================================================
// PLANTILLA HTML PARA EL ADMINISTRADOR
// ===================================================
export function generarHtmlAdministrador(orden: any): string {
  const filasProductos = orden.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #18181b;">
          <strong>${item.producto.nombre}</strong> (ID: ${item.productoId})
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #18181b; text-align: center;">
          x${item.cantidad}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; color: #18181b; text-align: right;">
          $${Number(item.precioUnitario).toLocaleString('es-AR')}
        </td>
      </tr>
    `
    )
    .join('');

  const tipoCliente = orden.usuarioId ? 'Usuario Registrado' : 'Cliente Invitado';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Nueva Venta Registrada</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e4e4e7;">
              
              <!-- Header Dashboard -->
              <tr>
                <td style="background-color: #09090b; padding: 20px 30px; border-bottom: 2px solid #22c55e;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="background-color: #166534; color: #4ade80; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                          NUEVA VENTA
                        </span>
                        <h2 style="margin: 10px 0 0 0; font-size: 18px; color: #ffffff; font-weight: 600;">
                          Orden #${orden.id}
                        </h2>
                      </td>
                      <td align="right" style="color: #a1a1aa; font-size: 13px;">
                        ${new Date().toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Datos del Cliente -->
                  <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #71717a; text-transform: uppercase;">
                    Datos del Comprador (${tipoCliente})
                  </h3>
                  <div style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #18181b;"><strong>Nombre:</strong> ${orden.nombreCliente}</p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #18181b;"><strong>Email:</strong> ${orden.emailCliente}</p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #18181b;"><strong>Teléfono:</strong> ${orden.telefono}</p>
                    <p style="margin: 0; font-size: 14px; color: #18181b;"><strong>Dirección:</strong> ${orden.direccion}</p>
                  </div>

                  <!-- Detalle de la Orden -->
                  <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #71717a; text-transform: uppercase;">
                    Productos a Despachar
                  </h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <thead>
                      <tr>
                        <th align="left" style="padding-bottom: 8px; border-bottom: 1px solid #18181b; font-size: 12px; color: #71717a;">Ítem</th>
                        <th align="center" style="padding-bottom: 8px; border-bottom: 1px solid #18181b; font-size: 12px; color: #71717a;">Cant.</th>
                        <th align="right" style="padding-bottom: 8px; border-bottom: 1px solid #18181b; font-size: 12px; color: #71717a;">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasProductos}
                    </tbody>
                  </table>

                  <!-- Total -->
                  <div style="text-align: right; font-size: 16px; font-weight: 700; color: #18181b; padding-top: 10px;">
                    Monto Total de la Venta: $${Number(orden.total).toLocaleString('es-AR')}
                  </div>

                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}