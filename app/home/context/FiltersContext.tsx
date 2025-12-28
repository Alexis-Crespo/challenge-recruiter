'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { type User } from '@/utils/api/users';
import { useUserFilters } from '../components/filters/useUserFilters';
import { useUsersPagination } from '../components/pagination/useUsersPagination';

type FiltersContextType = {
  allUsers: User[];
  filteredUsers: User[];
  currentUsers: User[];
  
  // Estado de filtros
  nameFilter: string;
  setNameFilter: (value: string) => void;
  seniorityFilters: Set<'JR' | 'SSR' | 'SR'>;
  languageFilters: Set<string>;
  hasActiveFilters: boolean;
  
  // Funciones de filtros
  toggleSeniorityFilter: (level: 'JR' | 'SSR' | 'SR') => void;
  toggleLanguageFilter: (language: string) => void;
  clearFilters: () => void;
  
  // Estado de paginación
  currentPage: number;
  totalPages: number;
  getPageNumbers: () => (number | 'ellipsis')[];
  handlePageChange: (page: number) => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

type FiltersProviderProps = {
  children: ReactNode;
  allUsers: User[];
}

export function FiltersProvider({ children, allUsers }: FiltersProviderProps) {
  // Hook de filtros
  const {
    nameFilter,
    setNameFilter,
    seniorityFilters,
    languageFilters,
    toggleSeniorityFilter,
    toggleLanguageFilter,
    clearFilters,
    filteredUsers,
    hasActiveFilters,
  } = useUserFilters(allUsers);

  // Hook de paginación (depende de filteredUsers)
  const { currentPage, totalPages, currentUsers, getPageNumbers, handlePageChange } =
    useUsersPagination(filteredUsers);

  const value: FiltersContextType = {
    // Datos
    allUsers,
    filteredUsers,
    currentUsers,
    
    // Filtros
    nameFilter,
    setNameFilter,
    seniorityFilters,
    languageFilters,
    hasActiveFilters,
    
    // Funciones de filtros
    toggleSeniorityFilter,
    toggleLanguageFilter,
    clearFilters,
    
    // Paginación
    currentPage,
    totalPages,
    getPageNumbers,
    handlePageChange,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFiltersContext debe ser usado dentro de un FiltersProvider');
  }
  return context;
}

