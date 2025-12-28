export function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function saveTokenToStorage(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Guardar en localStorage
  localStorage.setItem('token', token);
  
  // Guardar en cookie para el middleware
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 días
}

export function removeTokenFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Remover de localStorage
  localStorage.removeItem('token');
  
  // Remover cookie
  document.cookie = 'token=; path=/; max-age=0';
}

// ============================================
// Funciones del servidor para JWT
// ============================================

import jwt, { type SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
}

export function generateToken(
  payload: TokenPayload,
  expiresIn: string | number = '7d'
): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  } as SignOptions);
}

/**
 * Verifica y decodifica un token JWT en el servidor
 * @param token - Token JWT a verificar
 * @returns Payload decodificado si es válido, null si es inválido
 */
export function verifyToken(token: string): TokenPayload | null {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
