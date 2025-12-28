import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../useUsers';
import * as usersApi from '@/utils/api/users';
import * as authGuard from '@/app/hooks/useAuthGuard';

// Mock de las dependencias
vi.mock('@/utils/api/users', () => ({
  getUsers: vi.fn(),
}));

vi.mock('@/app/hooks/useAuthGuard', () => ({
  useAuthGuard: vi.fn(),
}));

describe('useUsers', () => {
  const mockUsers = [
    {
      username: 'user1',
      email: 'user1@test.com',
      score: 1000,
      joined_at: '2024-01-01',
      skills: [],
    },
    {
      username: 'user2',
      email: 'user2@test.com',
      score: 1200,
      joined_at: '2024-01-02',
      skills: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar usuarios exitosamente', async () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    // Estado inicial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.allUsers).toEqual([]);
    expect(result.current.error).toBe(null);

    // Esperar a que se complete la carga
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allUsers).toEqual(mockUsers);
    expect(result.current.error).toBe(null);
  });

  it('debe manejar errores al cargar usuarios', async () => {
    vi.mocked(usersApi.getUsers).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allUsers).toEqual([]);
    expect(result.current.error).toBe('Error al cargar los usuarios. Por favor, intenta nuevamente.');
  });

  it('debe llamar a useAuthGuard para proteger la ruta', () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue([]);

    renderHook(() => useUsers());

    expect(authGuard.useAuthGuard).toHaveBeenCalled();
  });
});

