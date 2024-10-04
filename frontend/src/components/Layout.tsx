'use client';
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-gray-800 text-white p-4'>
        <div className='flex items-center justify-between'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='md:hidden'>
            ☰
          </button>
          <nav className='hidden md:flex space-x-4'>
            <Link href='/campaigns/all'>Campaigns</Link>
            <Link href='/leads/all'>Leads</Link>
            <div className='relative group'>
              <button className='focus:outline-none'>
                Email Accounts
              </button>
              <div className='absolute left-0 mt-0.5 hidden group-hover:block bg-white text-black shadow-md rounded'>
                <Link href='/email-accounts/manage' className='block px-4 py-2 hover:bg-gray-200'>Manage Accounts</Link>
                <Link href='/email-accounts/setup' className='block px-4 py-2 hover:bg-gray-200'>Add New Account</Link>
                <Link href='/email-accounts/generate' className='block px-4 py-2 hover:bg-gray-200'>Generate Accounts</Link>
                <Link href='/email-accounts/import-bulk' className='block px-4 py-2 hover:bg-gray-200'>Import Bulk</Link>
              </div>
            </div>
            <Link href='/domains/manage'>Domains</Link>
            {/* Add other navigation links as needed */}
          </nav>
        </div>
      </header>
      
      <div className='flex flex-grow'>
        {/* Sidebar */}
        <aside className={clsx('bg-gray-200 w-64 p-4', { 'block': isSidebarOpen, 'hidden': !isSidebarOpen })}>
          <nav className='flex flex-col space-y-2'>
            <Link href='/campaigns/all' className='hover:bg-gray-300 p-2 rounded'>Campaigns</Link>
            <Link href='/leads/all' className='hover:bg-gray-300 p-2 rounded'>Leads</Link>
            <div>
              <span className='block font-semibold mb-1'>Email Accounts</span>
              <Link href='/email-accounts/manage' className='hover:bg-gray-300 p-2 rounded'>Manage Accounts</Link>
              <Link href='/email-accounts/setup' className='hover:bg-gray-300 p-2 rounded'>Add New Account</Link>
              <Link href='/email-accounts/generate' className='hover:bg-gray-300 p-2 rounded'>Generate Accounts</Link>
              <Link href='/email-accounts/import-bulk' className='hover:bg-gray-300 p-2 rounded'>Import Bulk</Link>
            </div>
            <Link href='/domains/manage' className='hover:bg-gray-300 p-2 rounded'>Domains</Link>
            {/* Add other navigation links as needed */}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className='flex-grow p-4'>
          {children}
        </main>
      </div>
      
      <footer className='bg-gray-100 text-center p-4'>
        &copy; 2024
      </footer>
    </div>
  );
};

export default Layout;

