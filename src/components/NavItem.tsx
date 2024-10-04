// src/components/NavItem.tsx
import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';

interface NavItemProps {
  icon: ReactNode;
  title: string;
  href: string;
  children?: ReactNode;
  isOpen: boolean;
}

const NavItem = ({ icon, title, href, children, isOpen }: NavItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  const toggleExpand = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the default link behavior and event propagation
    setIsExpanded(!isExpanded);
  };

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

        {/* Submenu Toggle Button */}
        {children && isOpen && (
          <button
            className="ml-auto focus:outline-none"
            onClick={toggleExpand} // Toggle submenu
          >
            <FiChevronDown
              className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Submenu Items */}
      {children && isExpanded && isOpen && (
        <ul className="ml-8 mt-2 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
