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
