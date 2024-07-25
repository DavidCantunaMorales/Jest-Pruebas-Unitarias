/* eslint-disable no-undef */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsuarioList from '../src/components/UsuarioList';
import { MemoryRouter } from 'react-router-dom';

// Mock de fetch
const mockFetch = jest.fn((url) => {
  const responses = {
    'http://localhost:4000/users': {
      usuarios: [{ id_usuario: 1, nombre_usuario: 'David', id_rol: 1 }]
    },
    'http://localhost:4000/roles': {
      roles: [{ id_rol: 1, nombre_rol: 'Administrador' }]
    }
  };
  return Promise.resolve({
    json: () => Promise.resolve(responses[url] || { usuarios: [], roles: [] })
  });
});

describe('UsuarioList', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  test('Muestra la lista de usuarios correctamente', async () => {
    render(
      <MemoryRouter>
        <UsuarioList />
      </MemoryRouter>
    );

    // Verificar que el título y el botón "Nuevo Usuario" se renderizan
    expect(screen.getByText('LISTA DE USUARIOS')).toBeInTheDocument();
    expect(screen.getByText('NUEVO USUARIO')).toBeInTheDocument();

    // Esperar a que los usuarios se carguen y verificar que el nombre de usuario se muestra
    await waitFor(() => {
      expect(screen.getByText('David')).toBeInTheDocument();
      expect(screen.getByText('Administrador')).toBeInTheDocument();
    });
  });
  test('Interacción del modal de creacion de un nuevo usuario', async () => {
    render(
      <MemoryRouter>
        <UsuarioList />
      </MemoryRouter>
    );

    // Abre el diálogo
    fireEvent.click(screen.getByText('NUEVO USUARIO'));

    // Verifica que el diálogo está abierto
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('CREAR USUARIO')).toBeInTheDocument();
    });

    // Cierra el diálogo
    fireEvent.click(screen.getByText('CANCELAR'));

    // Verifica que el diálogo está cerrado
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
