import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 px-4 md:px-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ColdEmail Dashboard. All rights reserved.
      </p>
      <div className="flex space-x-4 mt-2 md:mt-0">
        <Link href="/terms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;