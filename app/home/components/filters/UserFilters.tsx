import React from 'react';
import { availableLanguages, languageIcons } from './useUserFilters';
import { useFiltersContext } from '../../context/FiltersContext';

export function UserFilters() {
  const {
    nameFilter,
    setNameFilter,
    seniorityFilters,
    languageFilters,
    toggleSeniorityFilter,
    toggleLanguageFilter,
    clearFilters,
    hasActiveFilters,
    allUsers,
    filteredUsers,
  } = useFiltersContext();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col gap-3">
        {/* Primera fila: Nombre, Limpiar y Seniority */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex gap-2">
            <input
              id="name-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb6731]/50 focus:border-[#fb6731] outline-none transition-colors text-sm"
            />
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                !hasActiveFilters
                  ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 hover:text-[#fb6731] border border-gray-300 hover:border-[#fb6731]/50 hover:bg-[#fb6731]/5'
              }`}
            >
              Limpiar
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleSeniorityFilter('JR')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${
                seniorityFilters.has('JR')
                  ? 'bg-[#fb6731] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#fb6731]/50 hover:bg-[#fb6731]/5'
              }`}
            >
              JR
            </button>
            <button
              type="button"
              onClick={() => toggleSeniorityFilter('SSR')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${
                seniorityFilters.has('SSR')
                  ? 'bg-[#fb6731] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#fb6731]/50 hover:bg-[#fb6731]/5'
              }`}
            >
              SSR
            </button>
            <button
              type="button"
              onClick={() => toggleSeniorityFilter('SR')}
              className={`px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${
                seniorityFilters.has('SR')
                  ? 'bg-[#fb6731] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#fb6731]/50 hover:bg-[#fb6731]/5'
              }`}
            >
              SR
            </button>
          </div>
        </div>

        {/* Segunda fila: Lenguajes */}
        <div className="flex flex-wrap gap-2">
          {availableLanguages.map((lang) => {
            const langLower = lang.toLowerCase();
            const isActive = languageFilters.has(langLower);
            const iconPath = languageIcons[langLower] || '/icons/default.svg';

            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguageFilter(lang)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#fb6731] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#fb6731]/50 hover:bg-[#fb6731]/5'
                }`}
                title={lang}
              >
                <img src={iconPath} alt={lang} className="w-5 h-5" />
                <span className="text-xs font-medium">{lang}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredUsers.length !== allUsers.length && (
        <div className="mt-3 text-sm text-gray-600">
          Mostrando {filteredUsers.length} de {allUsers.length} usuarios
        </div>
      )}
    </div>
  );
}

