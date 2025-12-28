'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUsersTable } from '../components/table/useUsersTable';
import { type User } from '@/utils/api/users';

interface UserInfoDialogContextType {
  isInfoDialogOpen: boolean;
  selectedUserInfo: User | null;
  formatDate: (dateString: string) => string;
  handleInfo: (user: User) => void;
  handleCloseInfoDialog: () => void;
}

const UserInfoDialogContext = createContext<UserInfoDialogContextType | undefined>(undefined);

interface UserInfoDialogProviderProps {
  children: ReactNode;
}

export function UserInfoDialogProvider({ children }: UserInfoDialogProviderProps) {
  const { isInfoDialogOpen, selectedUserInfo, formatDate, handleInfo, handleCloseInfoDialog } =
    useUsersTable();

  const value: UserInfoDialogContextType = {
    isInfoDialogOpen,
    selectedUserInfo,
    formatDate,
    handleInfo,
    handleCloseInfoDialog,
  };

  return (
    <UserInfoDialogContext.Provider value={value}>{children}</UserInfoDialogContext.Provider>
  );
}

export function useUserInfoDialogContext() {
  const context = useContext(UserInfoDialogContext);
  if (context === undefined) {
    throw new Error(
      'useUserInfoDialogContext debe ser usado dentro de un UserInfoDialogProvider'
    );
  }
  return context;
}

