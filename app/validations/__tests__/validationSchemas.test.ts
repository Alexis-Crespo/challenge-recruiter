import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  registerStep1Schema,
  registerStep2Schema,
} from '../validationSchemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    describe('Email validation', () => {
      it('debe validar un email correcto', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Test1234',
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar email vacío', () => {
        const invalidData = {
          email: '',
          password: 'Test1234',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Este campo es obligatorio');
        }
      });

      it('debe rechazar email inválido', () => {
        const invalidData = {
          email: 'not-an-email',
          password: 'Test1234',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Debe ser un correo electrónico válido');
        }
      });

      it('debe rechazar email sin dominio', () => {
        const invalidData = {
          email: 'test@',
          password: 'Test1234',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('Password validation', () => {
      it('debe validar password no vacío', () => {
        const validData = {
          email: 'test@example.com',
          password: 'anypassword',
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar password vacío', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '',
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Este campo es obligatorio');
        }
      });
    });
  });

  describe('registerStep1Schema', () => {
    describe('Password requirements', () => {
      it('debe validar password con todos los requisitos', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Test1234',
          repeatPassword: 'Test1234',
        };

        const result = registerStep1Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar password menor a 8 caracteres', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Test12',
          repeatPassword: 'Test12',
        };

        const result = registerStep1Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('La contraseña debe tener al menos 8 caracteres');
        }
      });

      it('debe rechazar password sin mayúsculas', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'test1234',
          repeatPassword: 'test1234',
        };

        const result = registerStep1Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          const messages = result.error.issues.map(issue => issue.message);
          expect(messages).toContain('La contraseña debe contener al menos una letra mayúscula');
        }
      });

      it('debe rechazar password sin minúsculas', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'TEST1234',
          repeatPassword: 'TEST1234',
        };

        const result = registerStep1Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          const messages = result.error.issues.map(issue => issue.message);
          expect(messages).toContain('La contraseña debe contener al menos una letra minúscula');
        }
      });

      it('debe rechazar password sin números', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'TestTest',
          repeatPassword: 'TestTest',
        };

        const result = registerStep1Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          const messages = result.error.issues.map(issue => issue.message);
          expect(messages).toContain('La contraseña debe contener al menos un número');
        }
      });

      it('debe rechazar si las contraseñas no coinciden', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Test1234',
          repeatPassword: 'Test5678',
        };

        const result = registerStep1Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Las contraseñas no coinciden');
        }
      });
    });
  });

  describe('registerStep2Schema', () => {
    describe('Name and Lastname validation', () => {
      it('debe validar nombres correctos', () => {
        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe aceptar nombres con acentos y ñ', () => {
        const validData = {
          name: 'José María',
          lastname: 'Núñez',
          dni: '12345678',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar nombres con números', () => {
        const invalidData = {
          name: 'Juan123',
          lastname: 'Pérez',
          dni: '12345678',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('No se permiten números');
        }
      });

      it('debe rechazar nombres vacíos', () => {
        const invalidData = {
          name: '',
          lastname: 'Pérez',
          dni: '12345678',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Este campo es obligatorio');
        }
      });
    });

    describe('DNI validation', () => {
      it('debe validar DNI de 8 dígitos', () => {
        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe validar DNI de 7 dígitos', () => {
        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '1234567',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe validar DNI de 10 dígitos', () => {
        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '1234567890',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar DNI menor a 7 dígitos', () => {
        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '123456',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El DNI debe tener entre 7 y 10 dígitos');
        }
      });

      it('debe rechazar DNI mayor a 10 dígitos', () => {
        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678901',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El DNI debe tener entre 7 y 10 dígitos');
        }
      });

      it('debe rechazar DNI con letras', () => {
        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '1234567A',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El DNI solo debe contener números');
        }
      });

      it('debe rechazar DNI vacío', () => {
        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '',
          dob: '1990-01-01',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Este campo es obligatorio');
        }
      });
    });

    describe('Date of Birth validation', () => {
      it('debe validar persona mayor de 18 años', () => {
        const twentyYearsAgo = new Date();
        twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
        const dateString = twentyYearsAgo.toISOString().split('T')[0];

        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: dateString,
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe validar persona exactamente de 18 años', () => {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        eighteenYearsAgo.setDate(eighteenYearsAgo.getDate() - 1); // Un día más viejo para estar seguro
        const dateString = eighteenYearsAgo.toISOString().split('T')[0];

        const validData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: dateString,
        };

        const result = registerStep2Schema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('debe rechazar persona menor de 18 años', () => {
        const fifteenYearsAgo = new Date();
        fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
        const dateString = fifteenYearsAgo.toISOString().split('T')[0];

        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: dateString,
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Debes tener al menos 18 años');
        }
      });

      it('debe rechazar fecha futura', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];

        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: dateString,
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          const messages = result.error.issues.map(issue => issue.message);
          expect(messages).toContain('La fecha debe ser menor a la fecha actual');
        }
      });

      it('debe rechazar fecha vacía', () => {
        const invalidData = {
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          dob: '',
        };

        const result = registerStep2Schema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Este campo es obligatorio');
        }
      });
    });
  });

  describe('registerSchema (complete)', () => {
    it('debe validar un registro completo válido', () => {
      const validData = {
        name: 'Juan',
        lastname: 'Pérez',
        email: 'juan@example.com',
        password: 'Test1234',
        repeatPassword: 'Test1234',
        dni: '12345678',
        dob: '1990-01-01',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debe rechazar registro con múltiples campos inválidos', () => {
      const invalidData = {
        name: 'Juan123', // Nombre con números
        lastname: '', // Apellido vacío
        email: 'not-an-email', // Email inválido
        password: 'test', // Password débil
        repeatPassword: 'different', // No coincide
        dni: '123', // DNI muy corto
        dob: '2010-01-01', // Menor de 18
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });

    it('debe validar con nombres compuestos y acentos', () => {
      const validData = {
        name: 'María José',
        lastname: 'González Núñez',
        email: 'maria@example.com',
        password: 'Test1234',
        repeatPassword: 'Test1234',
        dni: '87654321',
        dob: '1985-06-15',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

