'use server';

import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/jwt';
import type { LoginFormData } from '../validations/validationSchemas';

export async function loginUser(formData: LoginFormData): Promise<{
  success: boolean;
  token?: string;
  user?: {
    id?: string;
    email: string;  
    name?: string;
    lastname?: string;
    dni?: string;
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {email, password} = formData;

    const { data: users, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (searchError) {
      return {
        success: false,
        error: 'Error al buscar el usuario',
      };
    }

    if (!users || users.length === 0) {
      return {
        success: false,
        error: 'Correo electrónico o contraseña incorrectos',
      };
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Correo electrónico o contraseña incorrectos',
      };
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        dni: user.dni,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Error inesperado al iniciar sesión',
    };
  }
}
