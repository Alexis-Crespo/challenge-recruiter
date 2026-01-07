import { useState } from 'react';
import { toast } from 'sonner';

const FAVORITES_KEY = 'user_favorites';

export function useFavorites() {
  // Cargar favoritos desde localStorage al inicializar (lazy initialization)
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return new Set(parsed);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    }
    return new Set();
  });

  // Guardar favoritos en localStorage cuando cambien
  const saveFavorites = (newFavorites: Set<string>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
    }
  };

  const toggleFavorite = (username: string) => {
    const wasAdded = !favorites.has(username);
    
    setFavorites((prev) => {
      const newSet = new Set(prev);
      
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      saveFavorites(newSet);
      return newSet;
    });

    // Mostrar toast fuera del setState para evitar duplicados
    if (wasAdded) {
      toast.success('Usuario agregado a favoritos', {
        duration: 3000,
        dismissible: true,
        closeButton: true,
      });
    }
  };

  const isFavorite = (username: string) => favorites.has(username);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}

