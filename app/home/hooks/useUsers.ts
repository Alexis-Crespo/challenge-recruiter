import { useState, useEffect } from 'react';
import { getUsers, type User } from '@/utils/api/users';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';

export function useUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Proteger la ruta
  useAuthGuard();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUsers();
        setAllUsers(data);
      } catch (err) {
        setError('Error al cargar los usuarios. Por favor, intenta nuevamente.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    allUsers,
    isLoading,
    error,
  };
}

