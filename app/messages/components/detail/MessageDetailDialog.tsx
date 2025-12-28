import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMessageDetailContext } from '../../context/MessageDetailContext';
import { useMessagesContext } from '../../context/MessagesContext';

export function MessageDetailDialog() {
  const { selectedMessage, isDialogOpen, handleCloseDialog } = useMessageDetailContext();
  const { formatDate, getRoleBadgeColor } = useMessagesContext();

  if (!selectedMessage) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Detalle del Mensaje
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Información completa del mensaje enviado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Usuario Destinatario
              </label>
              <p className="text-gray-900 font-semibold">{selectedMessage.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Rol</label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                  selectedMessage.role
                )}`}
              >
                {selectedMessage.role}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <p className="text-gray-900">{selectedMessage.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mensaje</label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap break-words">
                {selectedMessage.message}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Fecha de Envío
              </label>
              <p className="text-gray-900">{formatDate(selectedMessage.submitted_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Estado</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                {selectedMessage.status}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleCloseDialog}
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

