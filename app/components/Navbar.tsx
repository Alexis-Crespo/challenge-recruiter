'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { getTokenFromStorage, removeTokenFromStorage } from '../helpers/jwt';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = getTokenFromStorage();
      setIsLoggedIn(!!token);
    };
    checkAuth();

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    removeTokenFromStorage();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const navigateTo = (path: string) => {
    if (pathname !== path) {
      router.push(path);
    }
    setIsMobileMenuOpen(false);
  };

  if (isLoggedIn) {
    return (
      <nav className="w-full bg-white border-b border-gray-100 relative">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer flex-shrink-0"
              onClick={() => navigateTo('/home')}
            />
            <h1
              className="text-base sm:text-xl text-gray-700 font-semibold cursor-pointer truncate"
              onClick={() => navigateTo('/home')}
            >
              Recruiter App
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => navigateTo('/home')}
              className={`text-sm font-medium transition-colors ${
                pathname === '/home'
                  ? 'text-[#fb6731]'
                  : 'text-gray-700 hover:text-[#fb6731]'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => navigateTo('/messages')}
              className={`text-sm font-medium transition-colors ${
                pathname === '/messages'
                  ? 'text-[#fb6731]'
                  : 'text-gray-700 hover:text-[#fb6731]'
              }`}
            >
              Mis mensajes
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => navigateTo('/home')}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/home'
                    ? 'bg-[#fb6731] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => navigateTo('/messages')}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/messages'
                    ? 'bg-[#fb6731] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mis mensajes
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="w-full px-4 sm:px-6 py-4 flex items-center justify-center gap-2 sm:gap-3 bg-white h-16 border-b border-gray-100">
      <Image
        src="/Logo.svg"
        alt="Logo"
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
      />
      <h1 className="text-base sm:text-xl text-gray-700 font-semibold truncate">
        Recruiter App
      </h1>
    </nav>
  );
}
