export interface FotoInput {
  url: string;
  orden?: number;
  esPrincipal?: boolean;
}

export interface ProductoInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  permitePersonalizacion?: boolean;
  categoriaId: number;
  fotos?: FotoInput[];
}

export interface DatosCheckout {
  sessionId: string;
  nombreCliente: string;
  emailCliente: string;
  telefono: string;
  direccion: string;
  usuarioId?: number;
}