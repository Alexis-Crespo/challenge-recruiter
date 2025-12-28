import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMessageDialog } from '../useMessageDialog';
import * as messagesApi from '@/utils/api/messages';
import { toast } from 'sonner';
import { mockRouter } from '../../../../../test/setup';

// Mock de las APIs
vi.mock('@/utils/api/messages', () => ({
  getRoles: vi.fn(),
  sendMessage: vi.fn(),
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useMessageDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.push.mockClear();
    localStorage.clear();
    
    // Mock getRoles por defecto
    vi.mocked(messagesApi.getRoles).mockResolvedValue(['Frontend', 'Backend', 'Fullstack', 'DBA']);
  });

  describe('Toast con botón clickeable', () => {
    it('debe mostrar toast con botón "Ver mensajes" al enviar exitosamente', async () => {
      vi.mocked(messagesApi.sendMessage).mockResolvedValue({
        id: 1,
        role: 'Frontend',
        msj: 'Test message',
        submitted_at: new Date().toISOString(),
        status: 'received',
      });

      const { result } = renderHook(() => useMessageDialog());

      // Abrir el diálogo
      act(() => {
        result.current.handleOpenDialog('Test User');
      });

      // Llenar el formulario
      act(() => {
        result.current.setFormData({
          role: 'Frontend',
          email: 'test@example.com',
          message: 'Test message',
        });
      });

      // Enviar el mensaje
      await act(async () => {
        await result.current.handleSubmitMessage({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      // Verificar que el toast se llamó con el botón de acción
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Mensaje enviado exitosamente',
          expect.objectContaining({
            description: 'Se ha enviado el mensaje y la copia al mail ingresado',
            action: expect.objectContaining({
              label: 'Ver mensajes',
              onClick: expect.any(Function),
            }),
            duration: 5000,
          })
        );
      });
    });

    it('debe navegar a /messages cuando se hace clic en el botón del toast', async () => {
      vi.mocked(messagesApi.sendMessage).mockResolvedValue({
        id: 1,
        role: 'Frontend',
        msj: 'Test message',
        submitted_at: new Date().toISOString(),
        status: 'received',
      });

      const { result } = renderHook(() => useMessageDialog());

      // Abrir el diálogo
      act(() => {
        result.current.handleOpenDialog('Test User');
      });

      // Llenar el formulario
      act(() => {
        result.current.setFormData({
          role: 'Frontend',
          email: 'test@example.com',
          message: 'Test message',
        });
      });

      // Enviar el mensaje
      await act(async () => {
        await result.current.handleSubmitMessage({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      // Obtener la función onClick del toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });

      const toastCall = vi.mocked(toast.success).mock.calls[0];
      const toastOptions = toastCall[1] as { action: { onClick: () => void } };
      const onClickHandler = toastOptions.action.onClick;

      // Simular clic en el botón del toast
      act(() => {
        onClickHandler();
      });

      // Verificar que se navegó a /messages
      expect(mockRouter.push).toHaveBeenCalledWith('/messages');
    });

    it('debe guardar el mensaje en localStorage antes de mostrar el toast', async () => {
      vi.mocked(messagesApi.sendMessage).mockResolvedValue({
        id: 1,
        role: 'Backend',
        msj: 'Another test',
        submitted_at: new Date().toISOString(),
        status: 'received',
      });

      const { result } = renderHook(() => useMessageDialog());

      act(() => {
        result.current.handleOpenDialog('John Doe');
      });

      act(() => {
        result.current.setFormData({
          role: 'Backend',
          email: 'john@example.com',
          message: 'Another test',
        });
      });

      await act(async () => {
        await result.current.handleSubmitMessage({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      // Verificar que se guardó en localStorage
      const savedMessages = localStorage.getItem('sentMessages');
      expect(savedMessages).toBeTruthy();

      const messages = JSON.parse(savedMessages!);
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        role: 'Backend',
        email: 'john@example.com',
        message: 'Another test',
        username: 'John Doe',
        status: 'received',
      });
    });

    it('debe cerrar el diálogo después de enviar exitosamente', async () => {
      vi.mocked(messagesApi.sendMessage).mockResolvedValue({
        id: 1,
        role: 'Fullstack',
        msj: 'Test',
        submitted_at: new Date().toISOString(),
        status: 'received',
      });

      const { result } = renderHook(() => useMessageDialog());

      act(() => {
        result.current.handleOpenDialog('Jane Doe');
      });

      expect(result.current.isDialogOpen).toBe(true);

      act(() => {
        result.current.setFormData({
          role: 'Fullstack',
          email: 'jane@example.com',
          message: 'Test',
        });
      });

      await act(async () => {
        await result.current.handleSubmitMessage({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      // Verificar que el diálogo se cerró
      await waitFor(() => {
        expect(result.current.isDialogOpen).toBe(false);
        expect(result.current.selectedUser).toBe(null);
      });
    });
  });

  describe('Manejo de errores', () => {
    it('NO debe mostrar botón en toast de error', async () => {
      vi.mocked(messagesApi.sendMessage).mockRejectedValue({
        response: {
          status: 422,
          data: {
            message: 'Rol inválido',
          },
        },
      });

      const { result } = renderHook(() => useMessageDialog());

      act(() => {
        result.current.handleOpenDialog('Test User');
      });

      act(() => {
        result.current.setFormData({
          role: 'InvalidRole',
          email: 'test@example.com',
          message: 'Test',
        });
      });

      await act(async () => {
        await result.current.handleSubmitMessage({ preventDefault: vi.fn() } as unknown as React.FormEvent);
      });

      // Verificar que el toast de error NO tiene botón de acción
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Error de validación',
          expect.objectContaining({
            description: 'Rol inválido',
          })
        );
      });

      const errorCall = vi.mocked(toast.error).mock.calls[0];
      const errorOptions = errorCall[1] as { action?: unknown };
      expect(errorOptions.action).toBeUndefined();
    });
  });
});

