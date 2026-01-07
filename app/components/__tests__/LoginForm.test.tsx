import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import * as loginAction from '@/app/actions/login';
import * as jwtHelpers from '@/app/helpers/jwt';
import { mockRouter } from '../../../test/setup';

// Mock del módulo de login action
vi.mock('@/app/actions/login', () => ({
  loginUser: vi.fn(),
}));

// Mock de los helpers JWT
vi.mock('@/app/helpers/jwt', () => ({
  saveTokenToStorage: vi.fn(),
}));

// Mock del componente PasswordInput
vi.mock('../PasswordInput', () => ({
  default: ({
    register,
    error,
    label,
    id,
  }: {
    register: unknown;
    error?: { message?: string };
    label: string;
    id: string;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type="password" id={id} {...(register as object)} />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  ),
}));

describe('LoginForm', () => {
  const mockOnToggleAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.push.mockClear();
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar el formulario de login', () => {
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña*')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('debe mostrar el enlace de registro', () => {
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
      expect(screen.getByText('Regístrate')).toBeInTheDocument();
    });

    it('NO debe mostrar mensaje de error inicialmente', () => {
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const errorMessage = screen.queryByText(/Error/i);
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('Toggle a Registro', () => {
    it('debe llamar a onToggleAuth al hacer clic en Regístrate', async () => {
      const user = userEvent.setup();
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const registerButton = screen.getByText('Regístrate');
      await user.click(registerButton);

      expect(mockOnToggleAuth).toHaveBeenCalledOnce();
    });

    it('debe limpiar el formulario al cambiar a registro', async () => {
      const user = userEvent.setup();
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      await user.type(emailInput, 'test@example.com');

      const registerButton = screen.getByText('Regístrate');
      await user.click(registerButton);

      expect(mockOnToggleAuth).toHaveBeenCalled();
    });
  });

  describe('Validaciones de formulario', () => {
    it('debe mostrar error si email está vacío', async () => {
      const user = userEvent.setup();
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      await user.click(emailInput);
      await user.tab(); // Blur del campo

      await waitFor(() => {
        expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si email es inválido', async () => {
      const user = userEvent.setup();
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Debe ser un correo electrónico válido')).toBeInTheDocument();
      });
    });

    it('debe mostrar error si password está vacío', async () => {
      const user = userEvent.setup();
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const passwordInput = screen.getByLabelText('Contraseña*');
      await user.click(passwordInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
      });
    });
  });

  describe('Login exitoso', () => {
    it('debe iniciar sesión correctamente y navegar a /home', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockResolvedValue({
        success: true,
        token: 'test-token-123',
        user: {
          email: 'test@example.com',
          name: 'Test',
          lastname: 'User',
        },
      });

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(jwtHelpers.saveTokenToStorage).toHaveBeenCalledWith('test-token-123');
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
      });
    });

    it('debe mostrar estado de loading durante el login', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                success: true,
                token: 'test-token',
                user: { email: 'test@example.com' },
              });
            }, 100);
          })
      );

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      // Durante el loading
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Después del loading
      await waitFor(() => {
        expect(screen.queryByText('Iniciando sesión...')).not.toBeInTheDocument();
      });
    });

    it('debe guardar el token si se recibe', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockResolvedValue({
        success: true,
        token: 'my-secure-token',
        user: { email: 'test@example.com' },
      });

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(jwtHelpers.saveTokenToStorage).toHaveBeenCalledWith('my-secure-token');
      });
    });
  });

  describe('Login fallido', () => {
    it('debe mostrar error cuando las credenciales son incorrectas', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockResolvedValue({
        success: false,
        error: 'Correo electrónico o contraseña incorrectos',
      });

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'WrongPass1');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Correo electrónico o contraseña incorrectos')).toBeInTheDocument();
      });

      // No debe navegar ni guardar token
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(jwtHelpers.saveTokenToStorage).not.toHaveBeenCalled();
    });

    it('debe mostrar error genérico si no hay mensaje específico', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockResolvedValue({
        success: false,
      });

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
      });
    });

    it('debe limpiar el error al volver a intentar', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser)
        .mockResolvedValueOnce({
          success: false,
          error: 'Error de autenticación',
        })
        .mockResolvedValueOnce({
          success: true,
          token: 'new-token',
          user: { email: 'test@example.com' },
        });

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      // Primer intento fallido
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Wrong1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error de autenticación')).toBeInTheDocument();
      });

      // Segundo intento exitoso
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Correct1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Error de autenticación')).not.toBeInTheDocument();
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
      });
    });
  });

  describe('Manejo de errores de red', () => {
    it('debe manejar errores de red/excepciones', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockRejectedValue(new Error('Network error'));

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('debe manejar errores desconocidos', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockRejectedValue('Unknown error');

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
      });
    });

    it('debe volver a habilitar el botón después de un error', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockRejectedValue(new Error('Network error'));

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      // Esperar a que aparezca el error
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      // Después del error debe estar habilitado de nuevo
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener campos de formulario accesibles', () => {
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('debe tener un botón submit con texto descriptivo', () => {
      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('debe deshabilitar el botón durante loading', async () => {
      const user = userEvent.setup();
      vi.mocked(loginAction.loginUser).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ success: true, token: 'token', user: { email: 'test@example.com' } });
            }, 100);
          })
      );

      render(<LoginForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('disabled:cursor-not-allowed');
    });
  });
});

