'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { type User } from '@/utils/api/users';
import { useUserFilters } from '../components/filters/useUserFilters';
import { useUsersPagination } from '../components/pagination/useUsersPagination';
import { useFavorites } from '../hooks/useFavorites';

type FiltersContextType = {
  allUsers: User[];
  filteredUsers: User[];
  currentUsers: User[];
  
  // Estado de filtros
  nameFilter: string;
  setNameFilter: (value: string) => void;
  seniorityFilters: Set<'JR' | 'SSR' | 'SR'>;
  languageFilters: Set<string>;
  showOnlyFavorites: boolean;
  hasActiveFilters: boolean;
  
  // Funciones de filtros
  toggleSeniorityFilter: (level: 'JR' | 'SSR' | 'SR') => void;
  toggleLanguageFilter: (language: string) => void;
  toggleShowOnlyFavorites: () => void;
  clearFilters: () => void;
  
  // Favoritos
  favorites: Set<string>;
  toggleFavorite: (username: string) => void;
  isFavorite: (username: string) => boolean;
  
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
  // Hook de favoritos
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Hook de filtros
  const {
    nameFilter,
    setNameFilter,
    seniorityFilters,
    languageFilters,
    showOnlyFavorites,
    toggleSeniorityFilter,
    toggleLanguageFilter,
    toggleShowOnlyFavorites,
    clearFilters,
    filteredUsers,
    hasActiveFilters,
  } = useUserFilters(allUsers, favorites);

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
    showOnlyFavorites,
    hasActiveFilters,
    
    // Funciones de filtros
    toggleSeniorityFilter,
    toggleLanguageFilter,
    toggleShowOnlyFavorites,
    clearFilters,
    
    // Favoritos
    favorites,
    toggleFavorite,
    isFavorite,
    
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

