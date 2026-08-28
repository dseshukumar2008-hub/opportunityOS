import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import * as AuthContext from '../../contexts/AuthContext';

// Mock the AuthContext hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
  const setup = (mockAuth) => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(mockAuth);

    return render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div data-testid="protected-content">Secret Content</div>} />
          </Route>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders a loading spinner when auth is loading', () => {
    const { container } = setup({ isAuthenticated: false, loading: true });
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeNull();
  });

  it('redirects to /login when user is not authenticated', () => {
    setup({ isAuthenticated: false, loading: false });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders child routes when user is authenticated', () => {
    setup({ isAuthenticated: true, loading: false });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
