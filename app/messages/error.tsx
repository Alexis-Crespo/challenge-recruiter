'use client';

import { useEffect } from 'react';
import Navbar from '../components/Navbar';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error en messages page:', error);
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mensajes Enviados</h1>
          <p className="text-gray-600">Historial de mensajes enviados a candidatos</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium text-center mb-4">
              {error.message || 'Error al cargar los mensajes. Por favor, intenta nuevamente.'}
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-[#fb6731] text-white rounded-lg hover:bg-[#fb6731]/90 transition-colors font-medium text-sm"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

