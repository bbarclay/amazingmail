import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  socialLogin: (provider: Provider) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session (you may need to implement this)
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch('/auth/v1/logout', { method: 'POST' });
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await fetch('/auth/v1/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!response.ok) throw new Error('Registration failed');
    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const resetPassword = async (email: string) => {
    const response = await fetch('/auth/v1/password-reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Password reset failed');
  };

  const socialLogin = async (provider: Provider) => {
    // Implement social login if needed
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, resetPassword, socialLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
