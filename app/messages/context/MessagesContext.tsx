'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMessages, type SentMessage } from '../hooks/useMessages';

interface MessagesContextType {
  messages: SentMessage[];
  formatDate: (dateString: string) => string;
  getRoleBadgeColor: (role: string) => string;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

interface MessagesProviderProps {
  children: ReactNode;
}

export function MessagesProvider({ children }: MessagesProviderProps) {
  const { messages, isLoading, error } = useMessages();

  if (error) {
    throw new Error(error);
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      Frontend: 'bg-blue-100 text-blue-800 border-blue-200',
      Backend: 'bg-green-100 text-green-800 border-green-200',
      Fullstack: 'bg-purple-100 text-purple-800 border-purple-200',
      DBA: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const value: MessagesContextType = {
    messages,
    formatDate,
    getRoleBadgeColor,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessagesContext() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessagesContext debe ser usado dentro de un MessagesProvider');
  }
  return context;
}

