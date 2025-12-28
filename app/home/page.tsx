'use client';

import Navbar from '../components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { useUsers } from './hooks/useUsers';
import { FiltersProvider } from './context/FiltersContext';
import { UserInfoDialogProvider } from './context/UserInfoDialogContext';
import { MessageDialogProvider } from './context/MessageDialogContext';
import { UserFilters } from './components/filters/UserFilters';
import { UsersPagination } from './components/pagination/UsersPagination';
import { UsersTable } from './components/table/UsersTable';
import { UserInfoDialog } from './components/table/UserInfoDialog';
import { MessageDialog } from './components/message/MessageDialog';

export default function Home() {
  const { allUsers, error } = useUsers();

  if (error) {
    throw new Error(error);
  }

  return (
    <FiltersProvider allUsers={allUsers}>
      <UserInfoDialogProvider>
        <MessageDialogProvider>
          <Navbar />
          <div className="container mx-auto py-4 px-4 max-w-7xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Usuarios</h1>
              <p className="text-gray-600 text-sm">
                Gestiona y visualiza todos los usuarios registrados
              </p>
            </div>

            <UserFilters />
            <UsersTable />
            <UsersPagination />
          </div>

          <UserInfoDialog />
          <MessageDialog />
          <Toaster position="top-right" />
        </MessageDialogProvider>
      </UserInfoDialogProvider>
    </FiltersProvider>
  );
}
