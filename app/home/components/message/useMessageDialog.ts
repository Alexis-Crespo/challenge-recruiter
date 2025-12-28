import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getRoles, sendMessage } from '@/utils/api/messages';
import { toast } from 'sonner';

export function useMessageDialog() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isRolePopoverOpen, setIsRolePopoverOpen] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Cargar roles cuando se abre el dialog
  useEffect(() => {
    if (isDialogOpen && roles.length === 0) {
      const fetchRoles = async () => {
        try {
          setIsLoadingRoles(true);
          const data = await getRoles();
          setRoles(data);
        } catch (err) {
          console.error('Error fetching roles:', err);
        } finally {
          setIsLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [isDialogOpen, roles.length]);

  // Validar si el formulario está completo
  const isFormValid = useMemo(() => {
    return (
      formData.role.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.message.trim() !== ''
    );
  }, [formData.role, formData.email, formData.message]);

  // Guardar mensaje en localStorage
  const saveMessageToLocalStorage = (messageData: typeof formData) => {
    try {
      const existingMessages = localStorage.getItem('sentMessages');
      const messages = existingMessages ? JSON.parse(existingMessages) : [];

      const newMessage = {
        ...messageData,
        username: selectedUser,
        submitted_at: new Date().toISOString(),
        status: 'received',
      };

      messages.push(newMessage);
      localStorage.setItem('sentMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleOpenDialog = (username: string) => {
    setSelectedUser(username);
    setIsDialogOpen(true);
    setSendError(null);
    setSendSuccess(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      role: '',
      email: '',
      message: '',
    });
    setSendError(null);
    setSendSuccess(false);
    setIsRolePopoverOpen(false);
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(false);

    // Validación básica
    if (!formData.role || !formData.email || !formData.message) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(formData);

      // Éxito (201)
      setSendSuccess(true);

      // Guardar en localStorage
      saveMessageToLocalStorage(formData);

      // Toast verde de éxito con botón para ir a Mis mensajes
      toast.success('Mensaje enviado exitosamente', {
        description: 'Se ha enviado el mensaje y la copia al mail ingresado',
        action: {
          label: 'Ver mensajes',
          onClick: () => router.push('/messages'),
        },
        duration: 5000,
      });

      // Cerrar el dialog inmediatamente
      handleCloseDialog();
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { error?: string; message?: string } };
      };

      if (error.response?.status === 422) {
        // Error 422 - rol inválido
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'El rol debe ser uno de: Frontend, Backend, Fullstack, DBA';

        setSendError(errorMessage);

        // Toast rojo de error
        toast.error('Error de validación', {
          description: errorMessage,
        });
      } else {
        // Otros errores
        const errorMessage = 'Error al enviar el mensaje. Por favor, intenta nuevamente.';
        setSendError(errorMessage);

        toast.error('Error al enviar', {
          description: errorMessage,
        });
      }

      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return {
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
    handleOpenDialog,
    handleCloseDialog,
    handleSubmitMessage,
  };
}

