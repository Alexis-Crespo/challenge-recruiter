import { describe, it, expect } from 'vitest';
import { handleSupabaseError, handleErrorResponse } from '../errorHandler';

describe('Error Handler', () => {
  describe('handleSupabaseError', () => {
    it('debe retornar mensaje por defecto para errores generales', () => {
      const error = new Error('Usuario no encontrado');

      const result = handleSupabaseError(error);

      expect(result).toBe('Ha ocurrido un error inesperado');
    });

    it('debe retornar mensaje por defecto para errores sin message', () => {
      const error = {};

      const result = handleSupabaseError(error);

      expect(result).toBe('Ha ocurrido un error inesperado');
    });

    it('debe manejar error de DNI duplicado', () => {
      const error = {
        message: 'duplicate key value violates unique constraint "users_dni_key"',
      };

      const result = handleSupabaseError(error);

      expect(result).toBe('Este DNI ya está registrado, inicia sesión.');
    });

    it('debe manejar error de email duplicado', () => {
      const error = {
        message: 'duplicate key value violates unique constraint "users_email_key"',
      };

      const result = handleSupabaseError(error);

      expect(result).toBe('Este email ya está registrado, inicia sesión.');
    });

    it('debe manejar errores null', () => {
      const result = handleSupabaseError(null);

      expect(result).toBe('Ha ocurrido un error inesperado');
    });

    it('debe usar mensaje personalizado por defecto', () => {
      const result = handleSupabaseError(null, 'Error personalizado');

      expect(result).toBe('Error personalizado');
    });
  });

  describe('handleErrorResponse', () => {
    it('debe retornar objeto con success false', () => {
      const error = {
        message: 'Test error',
      };

      const result = handleErrorResponse(error, 'Test error');

      expect(result).toEqual({
        success: false,
        error: 'Test error',
      });
    });

    it('debe usar mensaje por defecto si se proporciona', () => {
      const error = {};

      const result = handleErrorResponse(error, 'Custom default message');

      expect(result).toEqual({
        success: false,
        error: 'Custom default message',
      });
    });
  });
});

