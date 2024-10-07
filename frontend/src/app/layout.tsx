// src/app/layout.tsx

"use client";

import '../styles/globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import AuthenticatedLayout from './authenticated-layout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootLayoutContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated && pathname !== '/login') {
    // Redirect to login page
    window.location.href = '/login';
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isAuthenticated ? (
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      ) : (
        children
      )}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}

