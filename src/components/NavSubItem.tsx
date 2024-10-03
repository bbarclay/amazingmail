// src/components/NavSubItem.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavSubItemProps {
  title: string;
  href: string;
}

const NavSubItem = ({ title, href }: NavSubItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

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
