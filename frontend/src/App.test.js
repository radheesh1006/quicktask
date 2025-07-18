import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders AuthPage component on default route "/"', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  // Assuming AuthPage has a unique text like "Login" or "Welcome"
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('renders Dashboard component on "/dashboard" route', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );
  // Assuming Dashboard page has a unique text like "Dashboard"
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
