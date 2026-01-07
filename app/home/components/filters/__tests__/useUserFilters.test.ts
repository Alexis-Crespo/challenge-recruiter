import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserFilters } from '../useUserFilters';
import type { User } from '@/utils/api/users';

describe('useUserFilters', () => {
  const mockUsers: User[] = [
    {
      username: 'john_junior',
      score: 800, 
      joined_at: '2024-01-01',
      skills: [
        { language: 'JavaScript', level: 'intermediate' },
        { language: 'React', level: 'advanced' },
      ],
    },
    {
      username: 'jane_semi',
      score: 1100, // SSR (1000-1199)
      joined_at: '2024-01-01',
      skills: [
        { language: 'Python', level: 'advanced' },
        { language: 'JavaScript', level: 'intermediate' },
      ],
    },
    {
      username: 'bob_senior',
      score: 1500, // SR (1200+)
      joined_at: '2024-01-01',
      skills: [
        { language: 'Java', level: 'expert' },
        { language: 'TypeScript', level: 'advanced' },
      ],
    },
  ];

  describe('Estado inicial', () => {
    it('debe inicializar sin filtros', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      expect(result.current.nameFilter).toBe('');
      expect(result.current.seniorityFilters.size).toBe(0);
      expect(result.current.languageFilters.size).toBe(0);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('debe retornar todos los usuarios sin filtros', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      expect(result.current.filteredUsers).toHaveLength(3);
    });
  });

  describe('Filtro por nombre', () => {
    it('debe filtrar por nombre de usuario', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('john');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('john_junior');
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('debe ser case-insensitive', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('JOHN');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('john_junior');
    });

    it('debe manejar espacios en el filtro', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('  jane  ');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('jane_semi');
    });

    it('debe retornar array vacío si no hay coincidencias', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('nonexistent');
      });

      expect(result.current.filteredUsers).toHaveLength(0);
    });
  });

  describe('Filtro por seniority', () => {
    it('debe filtrar por JR', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('JR');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('john_junior');
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('debe filtrar por SSR', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('SSR');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('jane_semi');
    });

    it('debe filtrar por SR', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('SR');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('bob_senior');
    });

    it('debe permitir múltiples selecciones de seniority', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('JR');
        result.current.toggleSeniorityFilter('SR');
      });

      expect(result.current.filteredUsers).toHaveLength(2);
      expect(result.current.filteredUsers.some((u) => u.username === 'john_junior')).toBe(true);
      expect(result.current.filteredUsers.some((u) => u.username === 'bob_senior')).toBe(true);
    });

    it('debe remover filtro al hacer toggle de nuevo', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('JR');
      });
      expect(result.current.filteredUsers).toHaveLength(1);

      act(() => {
        result.current.toggleSeniorityFilter('JR');
      });
      expect(result.current.filteredUsers).toHaveLength(3);
    });
  });

  describe('Filtro por lenguajes', () => {
    it('debe filtrar por un lenguaje', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
      });

      expect(result.current.filteredUsers).toHaveLength(2);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('debe ser case-insensitive para lenguajes', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleLanguageFilter('JAVASCRIPT');
      });

      expect(result.current.filteredUsers).toHaveLength(2);
    });

    it('debe usar operador AND con múltiples lenguajes', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      // jane_semi tiene JavaScript Y Python
      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
        result.current.toggleLanguageFilter('Python');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('jane_semi');
    });

    it('debe retornar vacío si ningún usuario tiene todos los lenguajes', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
        result.current.toggleLanguageFilter('Java');
      });

      expect(result.current.filteredUsers).toHaveLength(0);
    });

    it('debe remover filtro de lenguaje al hacer toggle de nuevo', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
      });
      expect(result.current.filteredUsers).toHaveLength(2);

      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
      });
      expect(result.current.filteredUsers).toHaveLength(3);
    });
  });

  describe('Filtros combinados', () => {
    it('debe combinar filtro de nombre y seniority', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('bob');
        result.current.toggleSeniorityFilter('SR');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('bob_senior');
    });

    it('debe combinar todos los filtros', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('jane');
        result.current.toggleSeniorityFilter('SSR');
        result.current.toggleLanguageFilter('Python');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].username).toBe('jane_semi');
    });

    it('debe retornar vacío si los filtros no coinciden', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('john');
        result.current.toggleSeniorityFilter('SR'); // john es JR, no SR
      });

      expect(result.current.filteredUsers).toHaveLength(0);
    });
  });

  describe('Clear filters', () => {
    it('debe limpiar todos los filtros', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('john');
        result.current.toggleSeniorityFilter('JR');
        result.current.toggleLanguageFilter('JavaScript');
      });

      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.nameFilter).toBe('');
      expect(result.current.seniorityFilters.size).toBe(0);
      expect(result.current.languageFilters.size).toBe(0);
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.filteredUsers).toHaveLength(3);
    });
  });

  describe('hasActiveFilters', () => {
    it('debe ser false sin filtros', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('debe ser true con filtro de nombre', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.setNameFilter('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('debe ser true con filtro de seniority', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleSeniorityFilter('JR');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('debe ser true con filtro de lenguaje', () => {
      const { result } = renderHook(() => useUserFilters(mockUsers));

      act(() => {
        result.current.toggleLanguageFilter('JavaScript');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });
  });
});

