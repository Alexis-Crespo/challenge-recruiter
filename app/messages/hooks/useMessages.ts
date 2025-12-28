import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';

export interface SentMessage {
  role: string;
  email: string;
  message: string;
  username: string;
  submitted_at: string;
  status: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Proteger la ruta
  useAuthGuard();

  useEffect(() => {
    const loadMessages = () => {
      try {
        const storedMessages = localStorage.getItem('sentMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          // Ordenar por fecha más reciente primero
          parsedMessages.sort((a: SentMessage, b: SentMessage) => {
            return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
          });
          setMessages(parsedMessages);
        }
      } catch (err) {
        setError('Error al cargar los mensajes');
        console.error('Error loading messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  return {
    messages,
    isLoading,
    error,
  };
}

