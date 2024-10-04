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
