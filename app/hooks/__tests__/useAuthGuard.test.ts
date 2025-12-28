import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthGuard } from '../useAuthGuard';
import * as jwtHelpers from '../../helpers/jwt';
import { mockRouter } from '../../../test/setup';

// Mock del módulo jwt
vi.mock('../../helpers/jwt', () => ({
  getTokenFromStorage: vi.fn(),
}));

describe('useAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.push.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe redirigir a / si no hay token', () => {
    vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue(null);

    renderHook(() => useAuthGuard());

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('NO debe redirigir si hay token válido', () => {
    vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token');

    renderHook(() => useAuthGuard());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('debe verificar el token cada 2 segundos', () => {
    vi.mocked(jwtHelpers.getTokenFromStorage)
      .mockReturnValueOnce('token')
      .mockReturnValueOnce(null);

    renderHook(() => useAuthGuard());

    // Avanzar 2 segundos
    vi.advanceTimersByTime(2000);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('debe limpiar el intervalo al desmontar', () => {
    vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('token');

    const { unmount } = renderHook(() => useAuthGuard());

    const intervalCount = vi.getTimerCount();
    unmount();

    expect(vi.getTimerCount()).toBeLessThan(intervalCount);
  });

  it('debe escuchar cambios en localStorage', () => {
    vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('token');

    renderHook(() => useAuthGuard());

    // Simular evento de storage
    const storageEvent = new StorageEvent('storage', {
      key: 'token',
      newValue: null,
    });
    window.dispatchEvent(storageEvent);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});

