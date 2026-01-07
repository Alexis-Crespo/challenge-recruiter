// ESTE ENDPOINT ESTA HECHO PARA REEMPLAZAR AL QUE NO FUNCIONA

import { NextRequest, NextResponse } from 'next/server';

const VALID_ROLES = ['Frontend', 'Backend', 'Fullstack', 'DBA'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, email, message } = body;

    // Validar que el rol sea válido
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        {
          error: 'invalid_role',
          message: `El rol debe ser uno de: ${VALID_ROLES.join(', ')}`,
        },
        { status: 422 }
      );
    }

    // Validar que el email esté presente
    if (!email || !email.trim()) {
      return NextResponse.json(
        {
          error: 'invalid_email',
          message: 'El email es requerido',
        },
        { status: 422 }
      );
    }

    // Validar que el mensaje esté presente
    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          error: 'invalid_message',
          message: 'El mensaje es requerido',
        },
        { status: 422 }
      );
    }

    // Generar un ID aleatorio
    const id = Math.floor(Math.random() * 1000) + 1;

    // Respuesta exitosa
    return NextResponse.json(
      {
        id,
        role,
        msj: message,
        submitted_at: new Date().toISOString(),
        status: 'received',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'server_error',
        message: 'Error al procesar la solicitud',
      },
      { status: 500 }
    );
  }
}

