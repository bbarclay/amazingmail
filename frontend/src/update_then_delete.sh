#!/bin/bash

# Overwrite NavSubItem.tsx
cat > ./components/NavSubItem.tsx << 'EOF'
// components/NavSubItem.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavSubItemProps {
  title: string;
  href: string;
}

const NavSubItem: React.FC<NavSubItemProps> = ({ title, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`block p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
          isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
      >
        {title}
      </Link>
    </li>
  );
};

export default NavSubItem;
EOF

# Overwrite NavItem.tsx
cat > ./components/NavItem.tsx << 'EOF'
// components/NavItem.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: ReactNode;
  title: string;
  href: string;
  children?: ReactNode;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, title, href, children, isOpen }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="relative">
      <div
        className={`flex items-center p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 rounded-md ${
          isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
      >
        {/* Navigation Link */}
        <Link href={href} className="flex items-center flex-grow">
          <span className="text-xl">{icon}</span>
          {isOpen && <span className="ml-4">{title}</span>}
        </Link>
      </div>

      {/* Submenu Items - Always Expanded */}
      {children && isOpen && (
        <ul className="ml-8 mt-2 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
EOF

# Overwrite Sidebar.tsx
cat > ./components/Sidebar.tsx << 'EOF'
// components/Sidebar.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for optimization
import {
  FiHome,
  FiSend,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiAtSign,
  FiGlobe,
  FiBarChart2,
} from 'react-icons/fi';
import NavItem from './NavItem';
import NavSubItem from './NavSubItem';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav
      className={`transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-md ${
        isOpen ? 'w-64' : 'w-16'
      } h-screen relative`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Use Image component for optimization */}
          <Image src="/logo.svg" alt="Logo" className="h-8 w-8" width={32} height={32} />
          {isOpen && (
            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
              Cold Email
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <ul className="mt-4 space-y-2">
        {/* Dashboard */}
        <NavItem icon={<FiHome />} title="Dashboard" href="/" isOpen={isOpen} />

        {/* Campaigns */}
        <NavItem icon={<FiSend />} title="Campaigns" href="/campaigns" isOpen={isOpen}>
          <NavSubItem title="All Campaigns" href="/campaigns/all" />
          <NavSubItem title="Create Campaign" href="/campaigns/create" />
          <NavSubItem title="Templates" href="/campaigns/templates" />
        </NavItem>

        {/* Leads */}
        <NavItem icon={<FiUsers />} title="Leads" href="/leads" isOpen={isOpen}>
          <NavSubItem title="All Leads" href="/leads/all" />
          <NavSubItem title="Import Leads" href="/leads/import" />
          <NavSubItem title="Segmentation" href="/leads/segmentation" />
        </NavItem>

        {/* Email Accounts */}
        <NavItem icon={<FiAtSign />} title="Email Accounts" href="/email-accounts" isOpen={isOpen}>
          <NavSubItem title="Setup Email Accounts" href="/email-accounts/setup" />
          <NavSubItem title="Manage Accounts" href="/email-accounts/manage" />
        </NavItem>

        {/* Domains */}
        <NavItem icon={<FiGlobe />} title="Domains" href="/domains" isOpen={isOpen}>
          <NavSubItem title="Create Domains" href="/domains/create" />
          <NavSubItem title="Manage Domains" href="/domains/manage" />
        </NavItem>

        {/* Analytics */}
        <NavItem icon={<FiBarChart2 />} title="Analytics" href="/analytics" isOpen={isOpen} />

        {/* Help & Support */}
        <NavItem icon={<FiHelpCircle />} title="Help & Support" href="/support" isOpen={isOpen} />
      </ul>

      {/* Settings at the Bottom */}
      <div className="absolute bottom-0 p-4">
        <Link
          href="/settings"
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-200"
        >
          <FiSettings className="text-xl" />
          {isOpen && <span className="ml-2">Settings</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
EOF

echo "Components have been updated successfully."
