import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromStorage } from '../helpers/jwt';

/**
 * Hook para proteger rutas y detectar cuando se borra el token
 * Verifica periódicamente si el token existe
 */
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    // Verificación inicial
    const token = getTokenFromStorage();
    if (!token) {
      router.push('/');
      return;
    }

    // Verificar periódicamente si el token sigue existiendo (cada 2 segundos)
    const interval = setInterval(() => {
      const currentToken = getTokenFromStorage();
      if (!currentToken) {
        router.push('/');
      }
    }, 2000);

    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        router.push('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);
}

