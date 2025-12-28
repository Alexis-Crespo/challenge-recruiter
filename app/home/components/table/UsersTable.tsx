import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFiltersContext } from '../../context/FiltersContext';
import { useUserInfoDialogContext } from '../../context/UserInfoDialogContext';
import { useMessageDialogContext } from '../../context/MessageDialogContext';

export function UsersTable() {
  const { currentUsers } = useFiltersContext();
  const { formatDate, handleInfo } = useUserInfoDialogContext();
  const { handleOpenDialog } = useMessageDialogContext();
  
  const users = currentUsers;
  const onInfo = handleInfo;
  const onMessage = handleOpenDialog;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="text-center font-semibold text-gray-700 py-3 px-6">
              Usuario
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700 py-3 px-6">
              Fecha de ingreso
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700 py-3 px-6">
              Lenguajes
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700 py-3 px-6">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                No hay usuarios disponibles
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow
                key={user.username}
                className={`border-b border-gray-50 transition-colors hover:bg-gray-50/30 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                }`}
              >
                <TableCell className="text-center py-3 px-6 font-medium text-gray-900">
                  {user.username}
                </TableCell>
                <TableCell className="text-center py-3 px-6 text-gray-600">
                  {formatDate(user.joined_at)}
                </TableCell>
                <TableCell className="text-center py-3 px-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#fb6731]/10 text-[#fb6731] font-semibold text-sm">
                    {user.skills.length}
                  </span>
                </TableCell>
                <TableCell className="text-center py-3 px-6">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onInfo(user)}
                      className="px-3 py-1 border border-[#fb6731] text-[#fb6731] bg-white rounded-lg hover:bg-[#fb6731]/5 hover:border-[#fb6731]/80 active:scale-[0.98] transition-all duration-200 font-medium text-xs shadow-sm hover:shadow"
                    >
                      Info
                    </button>
                    <button
                      onClick={() => onMessage(user.username)}
                      className="px-3 py-1 border border-transparent bg-[#fb6731] text-white rounded-lg hover:bg-[#fb6731]/90 active:scale-[0.98] transition-all duration-200 font-medium text-xs shadow-sm hover:shadow-md"
                    >
                      Mensaje
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

