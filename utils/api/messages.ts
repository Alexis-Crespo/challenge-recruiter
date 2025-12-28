import apiClient from './client';
import axios from 'axios';

export interface RolesResponse {
  roles: string[];
}

export interface MessageData {
  role: string;
  email: string;
  message: string;
}

export interface MessageResponse {
  id: number;
  role: string;
  msj: string;
  submitted_at: string;
  status: string;
}

export const getRoles = async (): Promise<string[]> => {
  // Usa apiClient que ya tiene la base URL configurada
  const response = await apiClient.get<RolesResponse>('/roleslist');
  return response.data.roles;
};

export const sendMessage = async (data: MessageData): Promise<MessageResponse> => {
  // Usar el endpoint local de Next.js en lugar del mock
  const response = await axios.post<MessageResponse>('/api/messages', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

