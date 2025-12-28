import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMessages } from '../useMessages';

vi.mock('@/app/hooks/useAuthGuard', () => ({
  useAuthGuard: vi.fn(),
}));

describe('useMessages', () => {
  const mockMessages = [
    {
      role: 'Frontend',
      email: 'test@example.com',
      message: 'Test message 1',
      username: 'user1',
      submitted_at: '2024-01-02T10:00:00Z',
      status: 'received',
    },
    {
      role: 'Backend',
      email: 'test2@example.com',
      message: 'Test message 2',
      username: 'user2',
      submitted_at: '2024-01-01T10:00:00Z',
      status: 'received',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe cargar mensajes desde localStorage', async () => {
    localStorage.setItem('sentMessages', JSON.stringify(mockMessages));

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.error).toBe(null);
  });

  it('debe ordenar mensajes por fecha descendente', async () => {
    localStorage.setItem('sentMessages', JSON.stringify(mockMessages));

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // El mensaje más reciente debe ser primero
    expect(result.current.messages[0].submitted_at).toBe('2024-01-02T10:00:00Z');
    expect(result.current.messages[1].submitted_at).toBe('2024-01-01T10:00:00Z');
  });

  it('debe retornar array vacío si no hay mensajes en localStorage', async () => {
    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('debe manejar errores al parsear localStorage', async () => {
    localStorage.setItem('sentMessages', 'invalid json');

    const { result } = renderHook(() => useMessages());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar los mensajes');
  });
});

