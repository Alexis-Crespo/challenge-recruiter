type SupabaseError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

export function handleSupabaseError(
  error: SupabaseError | Error | unknown,
  defaultMessage: string = 'Ha ocurrido un error inesperado'
): string {
  if (!error) {
    return defaultMessage;
  }

  let errorMessage = '';
  
  if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = (error as SupabaseError).message || '';
  }

  // Error de DNI duplicado
  if (errorMessage.includes('users_dni_key')) {
    return 'Este DNI ya está registrado, inicia sesión.';
  }
  
  // Error de email duplicado
  if (errorMessage.includes('users_email_key')) {
    return 'Este email ya está registrado, inicia sesión.';
  }

  // Cualquier otro error
  return defaultMessage;
}

export function handleErrorResponse(
  error: SupabaseError | Error | unknown,
  defaultMessage?: string
) {
  return {
    success: false,
    error: handleSupabaseError(error, defaultMessage),
  };
}
