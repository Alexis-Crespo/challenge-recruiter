import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveTokenToStorage,
  getTokenFromStorage,
  removeTokenFromStorage,
  decodeToken,
} from '../jwt';


Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('JWT Helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
    vi.clearAllMocks();
  });

  describe('saveTokenToStorage', () => {
    it('debe guardar el token en localStorage', () => {
      const token = 'test-token-123';
      saveTokenToStorage(token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('debe sobrescribir el token existente', () => {
      saveTokenToStorage('old-token');
      saveTokenToStorage('new-token');

      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  describe('getTokenFromStorage', () => {
    it('debe retornar el token si existe', () => {
      const token = 'test-token-456';
      localStorage.setItem('token', token);

      expect(getTokenFromStorage()).toBe(token);
    });

    it('debe retornar null si no hay token', () => {
      expect(getTokenFromStorage()).toBe(null);
    });

    it('debe retornar null si localStorage está vacío', () => {
      localStorage.clear();
      expect(getTokenFromStorage()).toBe(null);
    });
  });

  describe('removeTokenFromStorage', () => {
    it('debe eliminar el token de localStorage', () => {
      localStorage.setItem('token', 'test-token');
      removeTokenFromStorage();

      expect(localStorage.getItem('token')).toBe(null);
    });

    it('no debe fallar si no hay token para eliminar', () => {
      expect(() => removeTokenFromStorage()).not.toThrow();
    });
  });

  describe('decodeToken', () => {
    it('debe decodificar un token JWT válido', () => {
 
    
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const decoded = decodeToken(token);

      expect(decoded).toHaveProperty('sub', '123');
      expect(decoded).toHaveProperty('name', 'Test User');
    });

    it('debe retornar null para token inválido', () => {
      const invalidToken = 'invalid.token.here';

      const decoded = decodeToken(invalidToken);

      expect(decoded).toBe(null);
    });

    it('debe retornar null para token vacío', () => {
      expect(decodeToken('')).toBe(null);
    });
  });
});

