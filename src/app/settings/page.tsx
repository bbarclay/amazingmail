'use client';

import React from 'react';
import Link from 'next/link';

export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/settings/account" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-medium mb-2">Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your account details, such as name, email, and password.</p>
        </Link>

        <Link href="/settings/billing" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-medium mb-2">Billing</h2>
          <p className="text-gray-500 dark:text-gray-400">View your billing history and update your payment information.</p>
        </Link>

        <Link href="/settings/notifications" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-medium mb-2">Notifications</h2>
          <p className="text-gray-500 dark:text-gray-400">Customize your notification preferences.</p>
        </Link>

        <Link href="/settings/domains" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-medium mb-2">Domains</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage connected domains and email sending configurations.</p>
        </Link>

        <Link href="/settings/api" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-medium mb-2">API</h2>
          <p className="text-gray-500 dark:text-gray-400">Generate and manage API keys for integrations.</p>
        </Link>
      </div>
    </div>
  );
}
