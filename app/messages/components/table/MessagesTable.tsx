import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMessagesContext } from '../../context/MessagesContext';
import { useMessageDetailContext } from '../../context/MessageDetailContext';

export function MessagesTable() {
  const { messages, formatDate, getRoleBadgeColor } = useMessagesContext();
  const { handleOpenMessage } = useMessageDetailContext();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="text-center font-semibold text-gray-700">Usuario</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Rol</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Email</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Mensaje</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Fecha de Envío
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message, index) => (
              <TableRow
                key={index}
                className={`border-b border-gray-50 transition-colors hover:bg-gray-50/30 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                }`}
              >
                <TableCell className="text-center py-3 px-6 font-medium text-gray-900">
                  {message.username}
                </TableCell>
                <TableCell className="text-center py-3 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      message.role
                    )}`}
                  >
                    {message.role}
                  </span>
                </TableCell>
                <TableCell className="text-center py-3 px-6 text-gray-600 text-sm">
                  {message.email}
                </TableCell>
                <TableCell className="text-center py-3 px-6 text-gray-600 text-sm">
                  <button
                    onClick={() => handleOpenMessage(message)}
                    className="max-w-[200px] truncate hover:text-[#fb6731] transition-colors cursor-pointer underline decoration-dotted underline-offset-2 block mx-auto"
                    title="Click para ver el mensaje completo"
                  >
                    {message.message}
                  </button>
                </TableCell>
                <TableCell className="text-center py-3 px-6 text-gray-600 text-sm">
                  {formatDate(message.submitted_at)}
                </TableCell>
                <TableCell className="text-center py-3 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {message.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {messages.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Total de mensajes enviados: {messages.length}
        </div>
      )}
    </>
  );
}

