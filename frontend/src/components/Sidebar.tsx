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
