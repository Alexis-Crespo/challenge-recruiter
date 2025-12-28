import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserInfoDialogContext } from '../../context/UserInfoDialogContext';

export function UserInfoDialog() {
  const { isInfoDialogOpen, selectedUserInfo, formatDate, handleCloseInfoDialog } =
    useUserInfoDialogContext();

  if (!selectedUserInfo) return null;

  const isOpen = isInfoDialogOpen;
  const user = selectedUserInfo;
  const onClose = handleCloseInfoDialog;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Información del Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Detalles completos del candidato
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Nombre de Usuario */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nombre de Usuario
            </label>
            <p className="text-lg text-gray-900 font-semibold">{user.username}</p>
          </div>

          {/* Score y Seniority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Score</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#fb6731]">{user.score}</span>
                <span className="text-sm text-gray-500">puntos</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Seniority
              </label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.score >= 1200
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : user.score >= 1000
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}
              >
                {user.score >= 1200 ? 'SR' : user.score >= 1000 ? 'SSR' : 'JR'}
              </span>
            </div>
          </div>

          {/* Fecha de Ingreso */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Fecha de Ingreso
            </label>
            <p className="text-gray-900">{formatDate(user.joined_at)}</p>
          </div>

          {/* Lenguajes/Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Habilidades Técnicas
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {user.skills.length > 0 ? (
                <div className="space-y-3">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-medium">{skill.language}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            skill.level === 'advanced'
                              ? 'bg-green-100 text-green-800'
                              : skill.level === 'intermediate'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {skill.level === 'advanced'
                            ? 'Avanzado'
                            : skill.level === 'intermediate'
                            ? 'Intermedio'
                            : 'Básico'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay habilidades registradas</p>
              )}
            </div>
          </div>

          {/* Total de Lenguajes */}
          <div className="bg-[#fb6731]/5 rounded-lg p-4 border border-[#fb6731]/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total de Lenguajes</span>
              <span className="text-2xl font-bold text-[#fb6731]">{user.skills.length}</span>
            </div>
          </div>

          {/* Botón Cerrar */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#fb6731] text-white text-sm rounded-lg hover:bg-[#fb6731]/90 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

