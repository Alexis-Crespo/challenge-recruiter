'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type SentMessage } from '../hooks/useMessages';

interface MessageDetailContextType {
  selectedMessage: SentMessage | null;
  isDialogOpen: boolean;
  handleOpenMessage: (message: SentMessage) => void;
  handleCloseDialog: () => void;
}

const MessageDetailContext = createContext<MessageDetailContextType | undefined>(undefined);

interface MessageDetailProviderProps {
  children: ReactNode;
}

export function MessageDetailProvider({ children }: MessageDetailProviderProps) {
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenMessage = (message: SentMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  const value: MessageDetailContextType = {
    selectedMessage,
    isDialogOpen,
    handleOpenMessage,
    handleCloseDialog,
  };

  return <MessageDetailContext.Provider value={value}>{children}</MessageDetailContext.Provider>;
}

export function useMessageDetailContext() {
  const context = useContext(MessageDetailContext);
  if (context === undefined) {
    throw new Error('useMessageDetailContext debe ser usado dentro de un MessageDetailProvider');
  }
  return context;
}

