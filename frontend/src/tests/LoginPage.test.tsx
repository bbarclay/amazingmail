import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../src/app/login/page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission with valid inputs', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error for invalid email', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('displays error for short password', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it('displays password strength meter', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'weakpass' } });
    expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'MediumPass123' } });
    expect(screen.getByText(/password strength: medium/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'StrongPass123!' } });
    expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument();
  });

  it('handles forgot password click', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(mockPush).toHaveBeenCalledWith('/forgot-password');
  });
});

