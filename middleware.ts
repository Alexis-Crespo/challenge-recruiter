import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // La validación de autenticación se hace en los componentes client-side
  // porque el token está en localStorage, no en cookies.
  // Este middleware solo maneja rutas básicas.
  
  // Permitir todas las peticiones - la protección se hace client-side
  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    '/',
    '/home/:path*',
    '/messages/:path*',
  ],
};
