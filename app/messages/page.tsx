'use client';

import Navbar from '../components/Navbar';
import { MessagesProvider } from './context/MessagesContext';
import { MessageDetailProvider } from './context/MessageDetailContext';
import { useMessagesContext } from './context/MessagesContext';
import { MessagesTable } from './components/table/MessagesTable';
import { EmptyState } from './components/table/EmptyState';
import { MessageDetailDialog } from './components/detail/MessageDetailDialog';

function MessagesContent() {
  const { messages } = useMessagesContext();

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-4 px-4 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mensajes Enviados</h1>
          <p className="text-gray-600">Historial de mensajes enviados a candidatos</p>
        </div>

        {messages.length === 0 ? <EmptyState /> : <MessagesTable />}
      </div>

      <MessageDetailDialog />
    </>
  );
}

export default function Messages() {
  return (
    <MessagesProvider>
      <MessageDetailProvider>
        <MessagesContent />
      </MessageDetailProvider>
    </MessagesProvider>
  );
}
