import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';


// Mock del módulo de register action
vi.mock('@/app/actions/register', () => ({
  registerUser: vi.fn(),
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

// Mock del componente Stepper
vi.mock('../Stepper', () => ({
  default: ({
    currentStep,
    steps,
  }: {
    currentStep: number;
    steps: Array<{ number: number; label: string }>;
  }) => (
    <div data-testid="stepper">
      {steps.map((step) => (
        <div
          key={step.number}
          data-testid={`step-${step.number}`}
          data-active={currentStep === step.number}
        >
          {step.label}
        </div>
      ))}
    </div>
  ),
}));

describe('RegisterForm', () => {
  const mockOnToggleAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar el paso 1 (Credenciales) por defecto', () => {
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument();
      expect(screen.getByTestId('stepper')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument(); // Email input
      expect(screen.getByLabelText('Contraseña*')).toBeInTheDocument();
      expect(screen.getByLabelText('Repetir Contraseña*')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
    });

    it('debe mostrar el enlace de login', () => {
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      expect(screen.getByText('Si ya tienes cuenta')).toBeInTheDocument();
      expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
    });

    it('NO debe mostrar el paso 2 inicialmente', () => {
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      expect(screen.queryByText('Nombre*')).not.toBeInTheDocument();
      expect(screen.queryByText('Apellido*')).not.toBeInTheDocument();
      expect(screen.queryByText('DNI*')).not.toBeInTheDocument();
    });
  });

  describe('Toggle a Login', () => {
    it('debe llamar a onToggleAuth al hacer clic en Inicia sesión', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      const loginButton = screen.getByText('Inicia sesión');
      await user.click(loginButton);

      expect(mockOnToggleAuth).toHaveBeenCalledOnce();
    });
  });

  describe('Navegación entre pasos', () => {
    it('debe avanzar al paso 2 cuando el paso 1 es válido', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      // Llenar paso 1
      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const repeatPasswordInput = screen.getByLabelText('Repetir Contraseña*');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.type(repeatPasswordInput, 'Test1234');

      // Click en Continuar
      const continueButton = screen.getByRole('button', { name: 'Continuar' });
      await user.click(continueButton);

      // Verificar que estamos en paso 2
      await waitFor(() => {
        expect(screen.getByText('Nombre*')).toBeInTheDocument();
        expect(screen.getByText('Apellido*')).toBeInTheDocument();
        expect(screen.getByText('DNI*')).toBeInTheDocument();
        expect(screen.getByText('Fecha de Nacimiento*')).toBeInTheDocument();
      });

      // Verificar que el botón Continuar ya no está
      expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument();
      // Verificar que aparecieron los botones del paso 2
      expect(screen.getByRole('button', { name: 'Atrás' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    });


    it('NO debe avanzar si el email es inválido', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      const emailInput = screen.getByRole('textbox');
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Debe ser un correo electrónico válido')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('Contraseña*');
      const repeatPasswordInput = screen.getByLabelText('Repetir Contraseña*');
      await user.type(passwordInput, 'Test1234');
      await user.type(repeatPasswordInput, 'Test1234');

      const continueButton = screen.getByRole('button', { name: 'Continuar' });
      await user.click(continueButton);

      // NO debe avanzar
      expect(screen.queryByText('Nombre*')).not.toBeInTheDocument();
    });

    it('debe volver al paso 1 al hacer clic en Atrás', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      // Avanzar al paso 2
      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const repeatPasswordInput = screen.getByLabelText('Repetir Contraseña*');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.type(repeatPasswordInput, 'Test1234');
      await user.click(screen.getByRole('button', { name: 'Continuar' }));

      await waitFor(() => {
        expect(screen.getByText('Nombre*')).toBeInTheDocument();
      });

      // Volver atrás
      const backButton = screen.getByRole('button', { name: 'Atrás' });
      await user.click(backButton);

      // Verificar que volvimos al paso 1
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
      });
      expect(screen.queryByText('Nombre*')).not.toBeInTheDocument();
    });
  });

  describe('Validaciones del paso 2', () => {
    it('debe mostrar campos del paso 2 correctamente', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      // Navegar al paso 2
      const emailInput = screen.getByRole('textbox');
      const passwordInput = screen.getByLabelText('Contraseña*');
      const repeatPasswordInput = screen.getByLabelText('Repetir Contraseña*');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Test1234');
      await user.type(repeatPasswordInput, 'Test1234');
      await user.click(screen.getByRole('button', { name: 'Continuar' }));

      await waitFor(() => {
        expect(screen.getByText('Nombre*')).toBeInTheDocument();
        expect(screen.getByText('Apellido*')).toBeInTheDocument();
        expect(screen.getByText('DNI*')).toBeInTheDocument();
        expect(screen.getByText('Fecha de Nacimiento*')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad de submit', () => {
    it('debe tener botón submit en el paso 2', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterForm onToggleAuth={mockOnToggleAuth} />);

      // Navegar al paso 2
      await user.type(screen.getByRole('textbox'), 'test@example.com');
      await user.type(screen.getByLabelText('Contraseña*'), 'Test1234');
      await user.type(screen.getByLabelText('Repetir Contraseña*'), 'Test1234');
      await user.click(screen.getByRole('button', { name: 'Continuar' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Crea tu cuenta' })).toBeInTheDocument();
      });
    });
  });
});

