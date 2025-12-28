import React from 'react';
import { useRouter } from 'next/navigation';

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No hay mensajes enviados</h3>
        <p className="mt-2 text-gray-500">
          Cuando envíes mensajes a candidatos, aparecerán aquí.
        </p>
        <button
          onClick={() => router.push('/home')}
          className="mt-6 px-4 py-2 bg-[#fb6731] text-white rounded-lg hover:bg-[#fb6731]/90 transition-colors"
        >
          Ir a Usuarios
        </button>
      </div>
    </div>
  );
}

