import React from 'react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import { Button } from '@/components/ui/Ubutton';
import { Input } from '@/components/ui/Uinput';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => (
  <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
    <div className="flex items-center">
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
        <FiMenu className="h-6 w-6" />
      </Button>
      <div className="relative w-64">
        <Input type="search" placeholder="Search..." className="pl-10 pr-4 py-2" />
        <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" className="relative">
        <FiBell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
      </Button>
      <DarkModeToggle />
    </div>
  </header>
);

export default Topbar;
