
npm install shadcn-ui --save-dev

# Initialize shadcn UI components
# npx shadcn-ui init this doesn't work


# Configure Tailwind CSS to integrate with shadcn components
cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
EOL

# Create global styles
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

# Update layout.tsx to include global styles, ThemeProvider, and i18n support
mkdir -p src/app
cat > src/app/layout.tsx <<'EOL'
import '../styles/globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation } from 'next-i18next';

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default appWithTranslation(RootLayout);
EOL

# Create next-i18next.config.js
cat > next-i18next.config.js <<'EOL'
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};
EOL

# Update next.config.js to include i18n configuration
cat > next.config.js <<'EOL'
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  reactStrictMode: true,
};
EOL

# Create utility functions
mkdir -p src/lib
cat > src/lib/utils.ts <<EOL
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOL

# Create UI components directory
mkdir -p src/components/ui

# Create Button component
cat > src/components/ui/Button.tsx <<'EOL'
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, buttonVariants };
EOL

# Create Input component
cat > src/components/ui/Input.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

export { Input };
EOL

# Create DropdownMenu component
cat > src/components/ui/DropdownMenu.tsx <<'EOL'
import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = React.forwardRef<
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

const DropdownMenuItem = React.forwardRef<
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

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
EOL

# Create Switch component
cat > src/components/ui/Switch.tsx <<'EOL'
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

const Switch = React.forwardRef<
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

export { Switch };
EOL

# Create Card components
cat > src/components/ui/Card.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg bg-white dark:bg-gray-800 shadow p-4', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-2', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-gray-700 dark:text-gray-300', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
EOL

# Create Skeleton component
cat > src/components/ui/Uskeleton.tsx <<'EOL'
import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-300 dark:bg-gray-700', className)}
      {...props}
    />
  );
}

export { Skeleton };
EOL

# Create DarkModeToggle component
cat > src/components/ui/DarkModeToggle.tsx <<'EOL'
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Ubutton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only render on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
EOL

# Create Sidebar component
mkdir -p src/components/layout
cat > src/components/layout/Sidebar.tsx <<'EOL'
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip } from '@headlessui/react';
import {
  Home,
  Send,
  User,
  AtSign,
  Globe,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronDown,
  Menu,
  List,
  FileImport,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  children?: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <nav
      className={cn(
        'bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          {isSidebarOpen && (
            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
              Cold Email
            </span>
          )}
        </Link>
        <button onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <ul className="space-y-2 py-4">
        <NavItem icon={<Home />} title="Dashboard" href="/" isOpen={isSidebarOpen} />
        <NavItem
          icon={<Send />}
          title="Campaigns"
          href="/campaigns"
          isOpen={isSidebarOpen}
          items={[
            { icon: <List />, title: 'All Campaigns', href: '/campaigns/all' },
            { icon: <Send />, title: 'Create Campaign', href: '/campaigns/create' },
            { icon: <FileImport />, title: 'Templates', href: '/campaigns/templates' },
          ]}
        />
        <NavItem
          icon={<User />}
          title="Leads"
          href="/leads"
          isOpen={isSidebarOpen}
          items={[
            { icon: <Users />, title: 'All Leads', href: '/leads/all' },
            { icon: <FileImport />, title: 'Import Leads', href: '/leads/import' },
            { icon: <Users />, title: 'Segmentation', href: '/leads/segmentation' },
          ]}
        />
        <NavItem
          icon={<AtSign />}
          title="Email Accounts"
          href="/email-accounts"
          isOpen={isSidebarOpen}
          items={[
            { icon: <AtSign />, title: 'Setup Email Accounts', href: '/email-accounts/setup' },
            { icon: <Settings />, title: 'Manage Accounts', href: '/email-accounts/manage' },
          ]}
        />
        <NavItem
          icon={<Globe />}
          title="Domains"
          href="/domains"
          isOpen={isSidebarOpen}
          items={[
            { icon: <Globe />, title: 'Create Domains', href: '/domains/create' },
            { icon: <Settings />, title: 'Manage Domains', href: '/domains/manage' },
          ]}
        />
        <NavItem icon={<BarChart2 />} title="Analytics" href="/analytics" isOpen={isSidebarOpen} />
        <NavItem icon={<Settings />} title="Settings" href="/settings" isOpen={isSidebarOpen} />
        <NavItem icon={<HelpCircle />} title="Help & Support" href="/support" isOpen={isSidebarOpen} />
      </ul>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isOpen: boolean;
  items?: Array<{ icon: React.ReactNode; title: string; href: string }>;
}

const NavItem: React.FC<NavItemProps> = ({ icon, title, href, isOpen, items }) => {
  const pathname = usePathname();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const hasChildren = items && items.length > 0;

  const content = (
    <div
      className={cn(
        'flex items-center px-4 py-2 transition-colors duration-200',
        isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300',
        'hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
      onClick={(e) => {
        if (hasChildren) {
          e.preventDefault();
          setIsSubmenuOpen(!isSubmenuOpen);
        }
      }}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      {isOpen && (
        <>
          <span>{title}</span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                'ml-auto h-4 w-4 transform transition-transform duration-200',
                isSubmenuOpen ? 'rotate-180' : ''
              )}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <li>
      {isOpen ? (
        <Link href={href}>{content}</Link>
      ) : (
        <Tooltip.Button as={Link} href={href} title={title}>
          {content}
        </Tooltip.Button>
      )}
      {isOpen && hasChildren && isSubmenuOpen && (
        <ul className="ml-6 mt-2 space-y-1">
          {items!.map((item, idx) => (
            <NavSubItem key={idx} icon={item.icon} title={item.title} href={item.href} />
          ))}
        </ul>
      )}
    </li>
  );
};

const NavSubItem: React.FC<{ icon: React.ReactNode; title: string; href: string }> = ({
  icon,
  title,
  href,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'flex items-center px-4 py-2 text-sm transition-colors duration-200',
          isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400',
          'hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
      >
        <span className="mr-3 h-4 w-4">{icon}</span>
        {title}
      </Link>
    </li>
  );
};

export default Sidebar;
EOL

# Create Header component
cat > src/components/layout/Header.tsx <<'EOL'
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Ubutton';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';

const Header: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
EOL

# Create Footer component
cat > src/components/layout/Footer.tsx <<'EOL'
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 px-6 mt-auto">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Cold Email Dashboard. All rights reserved.
        </p>
        <div className="space-x-4">
          <Link href="/terms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
EOL

# Create MainLayout component
cat > src/components/layout/MainLayout.tsx <<'EOL'
'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
EOL

# Create Dashboard page in src/app/page.tsx
cat > src/app/page.tsx <<'EOL'
'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/Uskeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Ucard';
import { Button } from '@/components/ui/Ubutton';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
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
        <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Quick Actions
        </h3>
        <div className="flex space-x-4">
          <Button>Create Campaign</Button>
          <Button variant="outline">Import Leads</Button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Recent Activity
        </h3>
        <Card>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <span className="text-gray-600 dark:text-gray-400">
                  Campaign "Summer Sale" sent to 500 leads
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-600 dark:text-gray-400">
                  100 new leads imported from CSV
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-600 dark:text-gray-400">
                  New email account connected: marketing@example.com
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

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

# Create placeholder logo and user avatar
mkdir -p public

# Create a placeholder logo using a simple SVG
cat > public/logo.svg <<'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#3b82f6" viewBox="0 0 24 24">
  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 17.93V20h-2v-.07c-3.312-.43-6-3.4-6-6.93h2c0 2.485 2.015 4.5 4.5 4.5S16 15.515 16 13h2c0 3.53-2.688 6.5-6 6.93zM12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"/>
</svg>
EOL

# Convert SVG to PNG for compatibility (optional step)
npx svg-to-img public/logo.svg --output public/logo.png || true

# Create placeholder user avatar (this can be a generated image)
curl -o public/placeholder-user.jpg https://via.placeholder.com/150 || true

# Create placeholder terms and privacy pages to prevent 404 errors
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
  "profile"
  "billing"
  "logout"
)
for page in "${pages[@]}"; do
  dir="src/app/$page"
  mkdir -p "$dir"

  # Generate the component name
  COMPONENT_NAME=$(echo "${page////_}" | sed -E 's/(^|_)([a-z])/\U\2/g')

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
done

# Fix router import issues in page components and navigation items
find src -type f -name "*.tsx" -exec sed -i '' 's/import { useRouter } from "next\/router"/import { useRouter } from "next\/navigation"/g' {} \; || true

# Final feedback message
echo "=============================================="
echo "All configurations, components, and fixes have been applied!"
echo "Navigate to the project directory and start the development server:"
echo ""
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "Open your browser and go to http://localhost:3000 to view the dashboard."
echo "All placeholder pages and the new dark mode toggle are set up!"
echo "=============================================="