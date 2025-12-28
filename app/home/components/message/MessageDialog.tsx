import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMessageDialogContext } from '../../context/MessageDialogContext';

export function MessageDialog() {
  const {
    isDialogOpen,
    selectedUser,
    roles,
    isLoadingRoles,
    isRolePopoverOpen,
    setIsRolePopoverOpen,
    formData,
    setFormData,
    isSending,
    sendError,
    sendSuccess,
    isFormValid,
    handleCloseDialog,
    handleSubmitMessage,
  } = useMessageDialogContext();

  const isOpen = isDialogOpen;
  const onClose = handleCloseDialog;
  const onSubmit = handleSubmitMessage;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enviar mensaje a {selectedUser}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa el formulario para enviar un mensaje al candidato.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Rol
            </Label>
            <Popover open={isRolePopoverOpen} onOpenChange={setIsRolePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#fb6731] focus:ring-2 focus:ring-[#fb6731]/20 transition-colors bg-white text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingRoles}
                >
                  <span className={formData.role ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.role ||
                      (isLoadingRoles ? 'Cargando roles...' : 'Selecciona o escribe un rol')}
                  </span>
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2 border-b border-gray-200">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Escribe un rol personalizado..."
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          setIsRolePopoverOpen(false);
                        }
                      }}
                      className="h-9 text-sm flex-1"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsRolePopoverOpen(false)}
                      disabled={!formData.role.trim()}
                      className="px-3 h-9 bg-[#fb6731] text-white text-xs rounded-lg hover:bg-[#fb6731]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                      title="Confirmar rol"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Enter</span>
                    </button>
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {roles.length > 0 ? (
                    <div className="p-1">
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, role });
                            setIsRolePopoverOpen(false);
                          }}
                          className="w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-100 transition-colors"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {isLoadingRoles ? 'Cargando...' : 'No hay roles disponibles'}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          {/* Mensaje informativo */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-800">
              Se enviará una copia de este mensaje al mail ingresado
            </p>
          </div>

          {sendError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {sendError}
            </div>
          )}

          {sendSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ¡Se ha enviado el mensaje y la copia al mail ingresado!
            </div>
          )}

          <DialogFooter className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSending || sendSuccess}
              className="px-3 py-1.5 bg-[#fb6731] text-white text-sm rounded-lg hover:bg-[#fb6731]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

