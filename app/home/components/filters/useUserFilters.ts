import { useState, useMemo, useEffect } from 'react';
import { type User } from '@/utils/api/users';

export const availableLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'React',
  'Node.js',
  'HTML',
  'CSS',
  'Go',
  'SQL',
];

export const languageIcons: Record<string, string> = {
  javascript: '/icons/javascript.svg',
  typescript: '/icons/typescript.svg',
  python: '/icons/python.svg',
  java: '/icons/java.svg',
  'c#': '/icons/csharp.png',
  react: '/icons/react.svg',
  'node.js': '/icons/nodejs.svg',
  html: '/icons/html.svg',
  css: '/icons/css.svg',
  go: '/icons/go.svg',
  sql: '/icons/sql.svg',
};

export function useUserFilters(allUsers: User[]) {
  const [nameFilter, setNameFilter] = useState('');
  const [seniorityFilters, setSeniorityFilters] = useState<Set<'JR' | 'SSR' | 'SR'>>(new Set());
  const [languageFilters, setLanguageFilters] = useState<Set<string>>(new Set());

  const toggleSeniorityFilter = (level: 'JR' | 'SSR' | 'SR') => {
    setSeniorityFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  const toggleLanguageFilter = (language: string) => {
    setLanguageFilters((prev) => {
      const newSet = new Set(prev);
      const langLower = language.toLowerCase();
      if (newSet.has(langLower)) {
        newSet.delete(langLower);
      } else {
        newSet.add(langLower);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setNameFilter('');
    setSeniorityFilters(new Set());
    setLanguageFilters(new Set());
  };

  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Filtrar por nombre
    if (nameFilter.trim()) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(nameFilter.toLowerCase().trim())
      );
    }

    // Filtrar por Seniority (múltiples selecciones)
    if (seniorityFilters.size > 0) {
      filtered = filtered.filter((user) => {
        if (seniorityFilters.has('JR') && user.score >= 750 && user.score < 1000) {
          return true;
        }
        if (seniorityFilters.has('SSR') && user.score >= 1000 && user.score < 1200) {
          return true;
        }
        if (seniorityFilters.has('SR') && user.score >= 1200) {
          return true;
        }
        return false;
      });
    }

    // Filtrar por lenguajes (AND - el usuario debe tener TODOS los lenguajes seleccionados)
    if (languageFilters.size > 0) {
      filtered = filtered.filter((user) => {
        return Array.from(languageFilters).every((lang) =>
          user.skills.some((skill) => skill.language.toLowerCase() === lang)
        );
      });
    }

    return filtered;
  }, [allUsers, nameFilter, seniorityFilters, languageFilters]);

  const hasActiveFilters = nameFilter !== '' || seniorityFilters.size > 0 || languageFilters.size > 0;

  return {
    nameFilter,
    setNameFilter,
    seniorityFilters,
    languageFilters,
    toggleSeniorityFilter,
    toggleLanguageFilter,
    clearFilters,
    filteredUsers,
    hasActiveFilters,
  };
}

