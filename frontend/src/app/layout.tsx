
// src/app/layout.tsx

// This tells Next.js to treat this component as a Client Component
"use client";
// src/app/layout.tsx
import '../styles/globals.css';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Sidebar'; // Import Sidebar component
import Footer from '@/components/Footer'; // Import Footer component
import Topbar from '@/components/Topbar'; // Import Topbar component

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* Topbar */}
              <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

              {/* Page Content */}
              <main className="flex-1 p-6">
                {children}
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
