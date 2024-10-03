import React from 'react';
import Link from 'next/link';

const NavSubItem = ({
  icon,
  title,
  href,
  isActive,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
}) => (
  <li>
    <Link href={href}>
      <div
        className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <span className="h-4 w-4">{icon}</span>
        <span className="ml-3">{title}</span>
      </div>
    </Link>
  </li>
);

export default NavSubItem;