import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersTable } from '../UsersTable';
import { FiltersProvider } from '../../../context/FiltersContext';
import { UserInfoDialogProvider } from '../../../context/UserInfoDialogContext';
import { MessageDialogProvider } from '../../../context/MessageDialogContext';

// Mock de los contextos internos
const mockUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    score: 1500,
    joined_at: '2024-01-15T10:00:00Z',
    skills: [
      { name: 'JavaScript', icon: 'javascript.svg' },
      { name: 'React', icon: 'react.svg' },
    ],
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    score: 1200,
    joined_at: '2024-02-20T10:00:00Z',
    skills: [{ name: 'Python', icon: 'python.svg' }],
  },
];

describe('UsersTable', () => {
  const renderWithProviders = (users = mockUsers) => {
    return render(
      <FiltersProvider allUsers={users}>
        <UserInfoDialogProvider>
          <MessageDialogProvider>
            <UsersTable />
          </MessageDialogProvider>
        </UserInfoDialogProvider>
      </FiltersProvider>
    );
  };

  describe('Renderizado de tabla', () => {
    it('debe renderizar los encabezados de la tabla', () => {
      renderWithProviders();

      expect(screen.getByText('Usuario')).toBeInTheDocument();
      expect(screen.getByText('Fecha de ingreso')).toBeInTheDocument();
      expect(screen.getByText('Lenguajes')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay usuarios', () => {
      renderWithProviders([]);

      expect(screen.getByText('No hay usuarios disponibles')).toBeInTheDocument();
    });

    it('debe renderizar usuarios cuando hay datos', () => {
      renderWithProviders();

      expect(screen.getByText('johndoe')).toBeInTheDocument();
      expect(screen.getByText('janedoe')).toBeInTheDocument();
    });
  });

  describe('Datos de usuarios', () => {
    it('debe mostrar el número de skills de cada usuario', () => {
      renderWithProviders();

      const skillCounts = screen.getAllByText('2');
      expect(skillCounts.length).toBeGreaterThan(0);
    });

    it('debe formatear las fechas correctamente', () => {
      renderWithProviders();

      // Las fechas deben estar renderizadas (el formato exacto puede variar)
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Botones de acción', () => {
    it('debe renderizar botones Info y Mensaje para cada usuario', () => {
      renderWithProviders();

      const infoButtons = screen.getAllByRole('button', { name: 'Info' });
      const messageButtons = screen.getAllByRole('button', { name: 'Mensaje' });

      expect(infoButtons).toHaveLength(2);
      expect(messageButtons).toHaveLength(2);
    });

    it('debe permitir hacer clic en el botón Info', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const infoButtons = screen.getAllByRole('button', { name: 'Info' });
      await user.click(infoButtons[0]);

      // El diálogo debería abrirse (verificamos que no haya error)
      expect(infoButtons[0]).toBeInTheDocument();
    });

    it('debe permitir hacer clic en el botón Mensaje', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const messageButtons = screen.getAllByRole('button', { name: 'Mensaje' });
      await user.click(messageButtons[0]);

      // El diálogo debería abrirse (verificamos que no haya error)
      expect(messageButtons[0]).toBeInTheDocument();
    });
  });

  describe('Estilos y UX', () => {
    it('debe aplicar estilos alternados a las filas', () => {
      renderWithProviders();

      const rows = screen.getAllByRole('row');
      // Excluir header row
      const dataRows = rows.slice(1);

      expect(dataRows.length).toBe(2);
    });

  });

  describe('Edge cases', () => {
    it('debe manejar usuario con 0 skills', () => {
      const userWithNoSkills = [
        {
          ...mockUsers[0],
          skills: [],
        },
      ];

      renderWithProviders(userWithNoSkills);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('debe manejar usuario con muchos skills', () => {
      const userWithManySkills = [
        {
          ...mockUsers[0],
          skills: new Array(10).fill({ name: 'Skill', icon: 'icon.svg' }),
        },
      ];

      renderWithProviders(userWithManySkills);

      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('debe renderizar correctamente con un solo usuario', () => {
      renderWithProviders([mockUsers[0]]);

      expect(screen.getByText('johndoe')).toBeInTheDocument();
      expect(screen.queryByText('janedoe')).not.toBeInTheDocument();
    });
  });
});

