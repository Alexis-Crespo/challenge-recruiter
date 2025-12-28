import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';
import * as jwtHelpers from '../../helpers/jwt';
import { mockRouter } from '../../../test/setup';

vi.mock('../../helpers/jwt', () => ({
  getTokenFromStorage: vi.fn(),
  removeTokenFromStorage: vi.fn(),
}));

// Mock adicional para usePathname
let mockPathname = '/';
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => mockRouter,
    usePathname: () => mockPathname,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.push.mockClear();
    mockPathname = '/';
    
    // Setup de localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  describe('Usuario NO autenticado', () => {
    beforeEach(() => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue(null);
    });

    it('debe renderizar solo el logo y título', () => {
      render(<Navbar />);

      expect(screen.getByText('Recruiter App')).toBeInTheDocument();
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    it('NO debe mostrar opciones de navegación', () => {
      render(<Navbar />);

      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.queryByText('Mis mensajes')).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
    });

    it('NO debe mostrar el botón de menú móvil', () => {
      render(<Navbar />);

      expect(screen.queryByLabelText('Toggle menu')).not.toBeInTheDocument();
    });
  });

  describe('Usuario autenticado', () => {
    beforeEach(() => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token-123');
    });

    it('debe renderizar las opciones de navegación', () => {
      render(<Navbar />);

      expect(screen.getByText('Recruiter App')).toBeInTheDocument();
      expect(screen.getByText('Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Mis mensajes')).toBeInTheDocument();
      expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    });

    it('debe hacer el logo clickeable y navegar a /home', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const logo = screen.getByAltText('Logo');
      await user.click(logo);

      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('debe navegar a /home al hacer clic en Usuarios', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const usuariosButton = screen.getAllByText('Usuarios')[0];
      await user.click(usuariosButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('debe navegar a /messages al hacer clic en Mis mensajes', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const mensajesButton = screen.getAllByText('Mis mensajes')[0];
      await user.click(mensajesButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/messages');
    });

    it('debe llamar a removeTokenFromStorage al hacer logout', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const logoutButton = screen.getAllByText('Cerrar sesión')[0];
      await user.click(logoutButton);

      expect(jwtHelpers.removeTokenFromStorage).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('debe resaltar la página activa (Usuarios)', () => {
      mockPathname = '/home';
      render(<Navbar />);

      const usuariosButton = screen.getAllByText('Usuarios')[0];
      expect(usuariosButton).toHaveClass('text-[#fb6731]');
    });

    it('debe resaltar la página activa (Mis mensajes)', () => {
      mockPathname = '/messages';
      render(<Navbar />);

      const mensajesButton = screen.getAllByText('Mis mensajes')[0];
      expect(mensajesButton).toHaveClass('text-[#fb6731]');
    });
  });

  describe('Menú móvil', () => {
    beforeEach(() => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token-123');
    });

    it('debe mostrar el botón de menú móvil', () => {
      render(<Navbar />);

      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('debe abrir y cerrar el menú móvil al hacer clic', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const menuButton = screen.getByLabelText('Toggle menu');

      // Inicialmente el menú no está visible (no hay botones duplicados)
      const usuariosButtons = screen.getAllByText('Usuarios');
      expect(usuariosButtons).toHaveLength(1); // Solo desktop

      // Abrir menú móvil
      await user.click(menuButton);

      // Ahora debe haber 2 botones Usuarios (desktop + mobile)
      await waitFor(() => {
        const usuariosButtonsAfter = screen.getAllByText('Usuarios');
        expect(usuariosButtonsAfter.length).toBeGreaterThan(1);
      });

      // Cerrar menú móvil
      await user.click(menuButton);

      // Volver a tener solo 1 botón (desktop)
      await waitFor(() => {
        const usuariosButtonsFinal = screen.getAllByText('Usuarios');
        expect(usuariosButtonsFinal).toHaveLength(1);
      });
    });

    it('debe cerrar el menú móvil después de navegar', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const menuButton = screen.getByLabelText('Toggle menu');
      await user.click(menuButton);

      // Menú abierto
      await waitFor(() => {
        expect(screen.getAllByText('Usuarios').length).toBeGreaterThan(1);
      });

      // Hacer clic en Usuarios del menú móvil
      const usuariosButtons = screen.getAllByText('Usuarios');
      const mobileUsuariosButton = usuariosButtons[usuariosButtons.length - 1];
      await user.click(mobileUsuariosButton);

      // Verificar navegación
      expect(mockRouter.push).toHaveBeenCalledWith('/home');

      // Menú debe cerrarse
      await waitFor(() => {
        expect(screen.getAllByText('Usuarios')).toHaveLength(1);
      });
    });

    it('debe cerrar el menú móvil después de logout', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const menuButton = screen.getByLabelText('Toggle menu');
      await user.click(menuButton);

      // Menú abierto
      await waitFor(() => {
        expect(screen.getAllByText('Cerrar sesión').length).toBeGreaterThan(1);
      });

      // Hacer clic en Cerrar sesión del menú móvil
      const logoutButtons = screen.getAllByText('Cerrar sesión');
      const mobileLogoutButton = logoutButtons[logoutButtons.length - 1];
      await user.click(mobileLogoutButton);

      expect(jwtHelpers.removeTokenFromStorage).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  describe('Listener de storage', () => {
    it('debe agregar listener de storage al montar', () => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token-123');
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      render(<Navbar />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('debe remover listener de storage al desmontar', () => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token-123');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<Navbar />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Responsive behavior', () => {
    beforeEach(() => {
      vi.mocked(jwtHelpers.getTokenFromStorage).mockReturnValue('valid-token-123');
    });

    it('debe tener clase hidden en el menú desktop para móvil', () => {
      render(<Navbar />);

      // El div que contiene los botones desktop debe tener clase 'hidden md:flex'
      const desktopMenu = screen.getByText('Usuarios').closest('div');
      expect(desktopMenu).toHaveClass('hidden', 'md:flex');
    });

    it('debe tener clase md:hidden en el botón hamburguesa', () => {
      render(<Navbar />);

      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveClass('md:hidden');
    });
  });
});

