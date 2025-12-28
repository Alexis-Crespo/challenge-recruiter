'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMessageDialog } from '../components/message/useMessageDialog';

interface MessageDialogContextType {
  isDialogOpen: boolean;
  selectedUser: string | null;
  roles: string[];
  isLoadingRoles: boolean;
  isRolePopoverOpen: boolean;
  setIsRolePopoverOpen: (value: boolean) => void;
  formData: {
    role: string;
    email: string;
    message: string;
  };
  setFormData: (data: { role: string; email: string; message: string }) => void;
  isSending: boolean;
  sendError: string | null;
  sendSuccess: boolean;
  isFormValid: boolean;
  handleOpenDialog: (username: string) => void;
  handleCloseDialog: () => void;
  handleSubmitMessage: (e: React.FormEvent) => void;
}

const MessageDialogContext = createContext<MessageDialogContextType | undefined>(undefined);

interface MessageDialogProviderProps {
  children: ReactNode;
}

export function MessageDialogProvider({ children }: MessageDialogProviderProps) {
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
    handleOpenDialog,
    handleCloseDialog,
    handleSubmitMessage,
  } = useMessageDialog();

  const value: MessageDialogContextType = {
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

  return <MessageDialogContext.Provider value={value}>{children}</MessageDialogContext.Provider>;
}

export function useMessageDialogContext() {
  const context = useContext(MessageDialogContext);
  if (context === undefined) {
    throw new Error('useMessageDialogContext debe ser usado dentro de un MessageDialogProvider');
  }
  return context;
}

