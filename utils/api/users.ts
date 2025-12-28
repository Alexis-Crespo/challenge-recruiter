import apiClient from './client';

export interface Skill {
  language: string;
  level: string;
}

export interface User {
  username: string;
  joined_at: string;
  skills: Skill[];
  score: number;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/userlist');
  return response.data;
};

