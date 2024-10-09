import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
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
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

const register = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('Starting registration process', { email, firstName, lastName });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful:', data);

      if (data && data.user) {
        console.log('Creating user profile');
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        console.log('Profile created successfully');

        // Automatically log in the user after successful registration
        console.log('Attempting automatic login');
        await login(email, password);
        console.log('Automatic login successful');
      } else {
        console.error('User data not available after registration');
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const socialLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
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

