'use server';

import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import type { RegisterFormData } from '../validations/validationSchemas';
import { handleErrorResponse } from '../helpers/errorHandler';

export async function registerUser(formData: RegisterFormData) {
  try {
    const { email, password, name, lastname, dni, dob } = formData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const supabase = await createClient();

    const userData = {
      email,
      password: hashedPassword,
      name,
      lastname,
      dni,
      dob,
    };

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (error) {
      return handleErrorResponse(error, 'Error al registrar el usuario');
    }

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    return handleErrorResponse(error, 'Error inesperado al registrar el usuario');
  }
}
