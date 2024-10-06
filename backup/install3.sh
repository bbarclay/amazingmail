#!/bin/bash

# Knowledge cutoff: 2023-10

# Function to run a command and handle errors
run_command() {
  "$@"
  local status=$?
  if [ $status -ne 0 ]; then
    echo "Error: Command '$*' failed with status $status."
  fi
  return $status
}

# Allow the user to specify the project name as a command-line argument
PROJECT_NAME="${1:-amazing-dashboard}"

# Check if project directory already exists
if [ -d "$PROJECT_NAME" ]; then
  echo "Directory '$PROJECT_NAME' already exists. Please choose a different project name or remove the existing directory."
  exit 1
fi

# Create a new Next.js project with TypeScript, ESLint, and Tailwind CSS
echo "Creating a new Next.js project: $PROJECT_NAME"
run_command npx create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --eslint \
  --src-dir \
  --use-npm

if [ $? -ne 0 ]; then
  echo "Failed to create Next.js app. Exiting."
  exit 1
fi

# Navigate into the project directory
cd "$PROJECT_NAME" || { echo "Failed to enter directory '$PROJECT_NAME'."; exit 1; }

# Install Tailwind CSS and initialize it
echo "Installing Tailwind CSS and its dependencies"
run_command npm install -D tailwindcss postcss autoprefixer
if [ $? -ne 0 ]; then
  echo "Failed to install Tailwind CSS dependencies."
fi

echo "Initializing Tailwind CSS"
run_command npx tailwindcss init -p
if [ $? -ne 0 ]; then
  echo "Failed to initialize Tailwind CSS."
fi

# Install necessary dependencies
echo "Installing additional dependencies"
run_command npm install lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-dropdown-menu @radix-ui/react-switch @headlessui/react next-themes
if [ $? -ne 0 ]; then
  echo "Failed to install some of the additional dependencies."
fi

# Configure Tailwind CSS in tailwind.config.js
echo "Configuring Tailwind CSS"

cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class', // Enable dark mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
EOL

if [ $? -ne 0 ]; then
  echo "Failed to configure Tailwind CSS."
fi

# Create global styles
echo "Creating global styles"
mkdir -p src/styles
cat > src/styles/globals.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
body {
  @apply bg-gray-100 dark:bg-gray-900 transition-colors duration-200;
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create global styles."
fi

# Update layout.tsx to include global styles and ThemeProvider
echo "Updating layout.tsx"

mkdir -p src/app
cat > src/app/layout.tsx <<'EOL'
import '../styles/globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to update layout.tsx."
fi

# Create utility functions
echo "Creating utility functions"
mkdir -p src/lib
cat > src/lib/utils.ts <<EOL
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create utility functions."
fi

# Create UI components directory
echo "Creating UI components"

mkdir -p src/components/ui

# Create Button component
echo "Creating Button component"
cat > src/components/ui/button.tsx <<'EOL'
import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
        icon: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 py-1.5',
        lg: 'h-11 px-8 py-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Button component."
fi

# Create Input component
echo "Creating Input component"
cat > src/components/ui/input.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Input component."
fi

# Create DropdownMenu component
echo "Creating DropdownMenu component"
cat > src/components/ui/dropdown-menu.tsx <<'EOL'
import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md bg-white dark:bg-gray-800 p-1 shadow-md',
      className
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create DropdownMenu component."
fi

# Create Switch component
echo "Creating Switch component"
cat > src/components/ui/switch.tsx <<'EOL'
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      props.checked ? 'bg-blue-600' : 'bg-gray-200',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        props.checked ? 'translate-x-5' : 'translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Switch component."
fi

# Create Card components
echo "Creating Card components"
cat > src/components/ui/card.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg bg-white dark:bg-gray-800 shadow p-4', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-2', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-gray-700 dark:text-gray-300', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Card components."
fi

# Create Skeleton component
echo "Creating Skeleton component"
cat > src/components/ui/Uskeleton.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-300 dark:bg-gray-700', className)}
      {...props}
    />
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Skeleton component."
fi

# Create DarkModeToggle component
echo "Creating DarkModeToggle component"
cat > src/components/ui/dark-mode-toggle.tsx <<'EOL'
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Ubutton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/UdropdownUmenu';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only render on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon">
        <Moon className="h-6 w-6" />
        <span className="sr-only">View notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ml-3 flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="/placeholder.svg"
              alt="User avatar"
            />
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Toggle Theme</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create DarkModeToggle component."
fi

# Create the dashboard page in src/app/page.tsx
echo "Creating dashboard page"
mkdir -p src/app
cat > src/app/page.tsx <<'EOL'
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell, ChevronDown, Home, Send, User, AtSign, Globe, BarChart2, Settings, HelpCircle,
  Search, Menu, ChevronRight, List, FileArrowUp, Users
} from 'lucide-react';
import { Button } from '@/components/ui/Ubutton';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/UdropdownUmenu';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Ucard';
import { Skeleton } from '@/components/ui/Uskeleton';
import DarkModeToggle from '@/components/ui/dark-mode-toggle';

export default function EnhancedDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`flex h-screen transition-colors duration-200`}>
      {/* Sidebar */}
      <nav className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            {isSidebarOpen && <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">Cold Email</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
        <ul className="space-y-2 py-4">
          <NavItem icon={<Home />} title="Dashboard" href="/" isOpen={isSidebarOpen} />
          <NavItem icon={<Send />} title="Campaigns" href="/campaigns" isOpen={isSidebarOpen}>
            <NavSubItem icon={<List />} title="All Campaigns" href="/campaigns/all" />
            <NavSubItem icon={<Send />} title="Create Campaign" href="/campaigns/create" />
            <NavSubItem icon={<FileArrowUp />} title="Templates" href="/campaigns/templates" />
          </NavItem>
          <NavItem icon={<User />} title="Leads" href="/leads" isOpen={isSidebarOpen}>
            <NavSubItem icon={<Users />} title="All Leads" href="/leads/all" />
            <NavSubItem icon={<FileArrowUp />} title="Import Leads" href="/leads/import" />
            <NavSubItem icon={<Users />} title="Segmentation" href="/leads/segmentation" />
          </NavItem>
          <NavItem icon={<AtSign />} title="Email Accounts" href="/email-accounts" isOpen={isSidebarOpen}>
            <NavSubItem icon={<AtSign />} title="Setup Email Accounts" href="/email-accounts/setup" />
            <NavSubItem icon={<Settings />} title="Manage Accounts" href="/email-accounts/manage" />
          </NavItem>
          <NavItem icon={<Globe />} title="Domains" href="/domains" isOpen={isSidebarOpen}>
            <NavSubItem icon={<Globe />} title="Create Domains" href="/domains/create" />
            <NavSubItem icon={<Settings />} title="Manage Domains" href="/domains/manage" />
          </NavItem>
          <NavItem icon={<BarChart2 />} title="Analytics" href="/analytics" isOpen={isSidebarOpen} />
          <NavItem icon={<Settings />} title="Settings" href="/settings" isOpen={isSidebarOpen} />
          <NavItem icon={<HelpCircle />} title="Help & Support" href="/support" isOpen={isSidebarOpen} />
        </ul>
      </nav>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 flex flex-col">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
                <Menu className="h-6 w-6" />
              </Button>
              <div className="relative w-64">
                <Input type="search" placeholder="Search..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
              <DarkModeToggle />
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 text-sm">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Dashboard</Link>
          <ChevronRight className="inline h-4 w-4 mx-1 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Overview</span>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <DashboardCard title="Emails Sent" value="1,234" />
                <DashboardCard title="Open Rate" value="45%" />
                <DashboardCard title="Click Rate" value="12%" />
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Quick Actions</h3>
            <div className="flex space-x-4">
              <Button>Create Campaign</Button>
              <Button variant="outline">Import Leads</Button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Recent Activity</h3>
            <Card>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Campaign "Summer Sale" sent to 500 leads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">100 new leads imported from CSV</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <AtSign className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-400">New email account connected: marketing@example.com</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 px-6 mt-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2024 Cold Email Dashboard. All rights reserved.</p>
            <div className="space-x-4">
              <Link href="/terms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// NavItem Component
function NavItem({ icon, title, href, isOpen, children }: {
  icon: React.ReactNode;
  title: string;
  href: string;
  isOpen: boolean;
  children?: React.ReactNode;
}) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const router = useRouter();
  const isActive = router.pathname ? router.pathname === href || router.pathname.startsWith(`${href}/`) : false;
  const hasChildren = React.Children.count(children) > 0;

  return (
    <li>
      <Link href={href} className={`flex items-center px-4 py-2 ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`} onClick={(e) => {
        if (hasChildren) {
          e.preventDefault();
          setIsSubmenuOpen(!isSubmenuOpen);
        }
      }}>
        <span className="mr-3 h-5 w-5">{icon}</span>
        {isOpen && (
          <>
            <span>{title}</span>
            {hasChildren && (
              <ChevronDown className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} />
            )}
          </>
        )}
      </Link>
      {isOpen && hasChildren && isSubmenuOpen && <ul className="ml-6 mt-2 space-y-1">{children}</ul>}
    </li>
  );
}

// NavSubItem Component
function NavSubItem({ icon, title, href }: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Link href={href} className={`flex items-center px-4 py-2 text-sm ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}>
        <span className="mr-3 h-4 w-4">{icon}</span>
        {title}
      </Link>
    </li>
  );
}

// DashboardCard Component
function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create dashboard page."
fi

# Create placeholder logo and user avatar
echo "Creating placeholder logo and user avatar"
mkdir -p public

# Create a placeholder logo using a simple SVG
cat > public/logo.svg <<'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#3b82f6" viewBox="0 0 24 24">
  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 17.93V20h-2v-.07c-3.312-.43-6-3.4-6-6.93h2c0 2.485 2.015 4.5 4.5 4.5S16 15.515 16 13h2c0 3.53-2.688 6.5-6 6.93zM12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"/>
</svg>
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create logo.svg."
fi

# Create a placeholder user avatar using SVG
cat > public/placeholder.svg <<'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6b7280" viewBox="0 0 24 24">
  <circle cx="12" cy="8" r="4" />
  <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
</svg>
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create placeholder.svg."
fi

# Create a placeholder logo.png using canvas (if needed)
# Alternatively, if you have a tool like 'svg-to-img' or 'sharp', you can convert SVG to PNG
# Here, we'll skip PNG creation and use SVG directly to avoid dependency issues

# Create placeholder terms and privacy pages to prevent 404 errors
echo "Creating placeholder terms and privacy pages"
mkdir -p src/app/terms src/app/privacy

# Example placeholder for Terms of Service
cat > src/app/terms/page.tsx <<'EOL'
'use client';

import React from 'react';

export default function TermsOfService() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">Your terms of service content goes here.</p>
    </div>
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Terms of Service page."
fi

# Example placeholder for Privacy Policy
cat > src/app/privacy/page.tsx <<'EOL'
'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">Your privacy policy content goes here.</p>
    </div>
  );
}
EOL

if [ $? -ne 0 ]; then
  echo "Failed to create Privacy Policy page."
fi

# Repeat similar placeholder creation for other pages
pages=(
  "campaigns/all"
  "campaigns/create"
  "campaigns/templates"
  "leads/all"
  "leads/import"
  "leads/segmentation"
  "email-accounts/setup"
  "email-accounts/manage"
  "domains/create"
  "domains/manage"
  "analytics"
  "settings"
  "support"
)

for page in "${pages[@]}"; do
  dir="src/app/$page"
  mkdir -p "$dir"
  if [ $? -ne 0 ]; then
    echo "Failed to create directory '$dir'."
    continue
  fi

  # Generate the component name by converting to PascalCase
  COMPONENT_NAME=$(echo "${page//\// }" | awk '{for(i=1;i<=NF;i++) {printf toupper(substr($i,1,1)) tolower(substr($i,2))}}')

  cat > "$dir/page.tsx" <<EOL
'use client';

import React from 'react';

export default function ${COMPONENT_NAME}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">${COMPONENT_NAME}</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">Content for the ${COMPONENT_NAME} page goes here.</p>
    </div>
  );
}
EOL

  if [ $? -ne 0 ]; then
    echo "Failed to create page component for '$page'."
  fi
done

# Install shadcn UI components library (Optional)
# If you're not using shadcn-ui, you can skip this step
echo "Installing shadcn-ui"
run_command npx shadcn-ui@latest init
if [ $? -ne 0 ]; then
  echo "Failed to initialize shadcn-ui. Please refer to shadcn-ui documentation for manual setup."
fi

# Update Tailwind CSS configuration to integrate with shadcn components
echo "Integrating shadcn UI with Tailwind CSS"

# Note: If shadcn-ui modifies tailwind.config.js, you might need to adjust accordingly.
# In this script, we assume shadcn-ui handles its own Tailwind integration.

# Fix router import issues in page components and navigation items

echo "Fixing router imports for Next.js 14 compatibility"

# Determine OS for sed compatibility
OS_TYPE=$(uname)
if [ "$OS_TYPE" = "Darwin" ]; then
  # macOS
  SED_INPLACE='-i '' '
else
  # Assume Linux
  SED_INPLACE='-i'
fi

# Execute sed command with appropriate in-place flag
find src -type f -name "*.tsx" -exec sed $SED_INPLACE 's/import { useRouter } from "next\/router"/import { useRouter } from "next\/navigation"/g' {} \; && echo "Router imports fixed." || echo "Failed to fix some router imports."

# Ensure logo.svg is used instead of logo.png to prevent 404 errors
echo "Ensuring logo.svg is used instead of logo.png in navigation"

# Replace logo.png references with logo.svg in all .tsx files
find src -type f -name "*.tsx" -exec sed $SED_INPLACE 's/logo\.png/logo.svg/g' {} \; && echo "Replaced logo.png with logo.svg in all .tsx files." || echo "Failed to replace logo.png with logo.svg in some files."

# Adjust placeholder image sources to use placeholder.svg
echo "Adjusting placeholder image sources to use placeholder.svg"

# Replace placeholder-user.jpg with placeholder.svg in all .tsx files
find src -type f -name "*.tsx" -exec sed $SED_INPLACE 's/placeholder\.jpg/placeholder.svg/g' {} \; && echo "Replaced placeholder.jpg with placeholder.svg in all .tsx files." || echo "Failed to replace placeholder.jpg with placeholder.svg in some files."

# Final feedback message
echo "=============================================="
echo "All configurations, components, and fixes have been applied!"
echo "Remember to verify shadcn-ui setup if it failed."
echo "Navigate to the project directory and start the development server:"
echo ""
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "Open your browser and go to http://localhost:3000 to view the dashboard."
echo "All placeholder pages and the new dark mode toggle are set up!"
echo "=============================================="
