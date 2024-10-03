import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

const NavItem = ({
  icon,
  title,
  href,
  isActive,
  isOpen,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
  isOpen: boolean;
  children?: React.ReactNode;
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActive);

  const hasChildren = React.Children.count(children) > 0;

  return (
    <li>
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        <span className="h-5 w-5">{icon}</span>
        {isOpen && (
          <>
            <span className="ml-3">{title}</span>
            {hasChildren && (
              <FiChevronDown
                className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${
                  isSubmenuOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </>
        )}
      </button>
      {isOpen && hasChildren && isSubmenuOpen && (
        <ul className="ml-8 mt-1 space-y-1">{children}</ul>
      )}
    </li>
  );
};

export default NavItem;
