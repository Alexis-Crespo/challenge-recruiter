import { z } from 'zod';

// Validación para nombre y apellido: no vacío y sin números
const nameSchema = z
  .string()
  .min(1, 'Este campo es obligatorio')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'No se permiten números');

// Validación para fecha de nacimiento: debe ser menor a hoy y la persona debe tener al menos 18 años
const birthDateSchema = z
  .string()
  .min(1, 'Este campo es obligatorio')
  .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, 'Debes tener al menos 18 años')
  .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today;
  }, 'La fecha debe ser menor a la fecha actual');

// Validación para DNI: solo números, entre 7 y 10 dígitos
const dniSchema = z
  .string()
  .min(1, 'Este campo es obligatorio')
  .regex(/^\d+$/, 'El DNI solo debe contener números')
  .refine((dni) => dni.length >= 7 && dni.length <= 10, {
    message: 'El DNI debe tener entre 7 y 10 dígitos',
  });

// Validación de contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
const passwordSchema = z
  .string()
  .min(1, 'Este campo es obligatorio')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número');

// Esquema de validación para el paso 1 del registro (credenciales)
export const registerStep1Schema = z
  .object({
    email: z
      .string()
      .min(1, 'Este campo es obligatorio')
      .email('Debe ser un correo electrónico válido'),
    password: passwordSchema,
    repeatPassword: z.string().min(1, 'Este campo es obligatorio'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  });

// Esquema de validación para el paso 2 del registro (información personal)
export const registerStep2Schema = z.object({
  name: nameSchema,
  lastname: nameSchema,
  dni: dniSchema,
  dob: birthDateSchema,
});

// Esquema de validación completo para registro
export const registerSchema = z
  .object({
    name: nameSchema,
    lastname: nameSchema,
    email: z
      .string()
      .min(1, 'Este campo es obligatorio')
      .email('Debe ser un correo electrónico válido'),
    password: passwordSchema,
    repeatPassword: z.string().min(1, 'Este campo es obligatorio'),
    dob: birthDateSchema,
    dni: dniSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  });

// Esquema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Este campo es obligatorio')
    .email('Debe ser un correo electrónico válido'),
  password: z.string().min(1, 'Este campo es obligatorio'),
});

// Tipos TypeScript derivados de los esquemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
