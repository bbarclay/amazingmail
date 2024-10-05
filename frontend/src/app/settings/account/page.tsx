'use client';

import React from 'react';

export default function AccountSettings() {
<<<<<<< .merge_file_T51SJN
// @todo: Create an endpoint to update profile information
return (
=======
  return (
>>>>>>> .merge_file_SWkZid
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-2">Profile Information</h2>
        {/* Input fields for name, email, password */}
        <div className="mb-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div className="mb-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <button className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Change Password</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-2">API Keys</h2>
<<<<<<< .merge_file_T51SJN
{/* // @todo: Create an endpoint for API key generation and management */}
{/* API key generation/management */}
=======
        {/* API key generation/management */}
>>>>>>> .merge_file_SWkZid
        <p className="text-gray-700 dark:text-gray-300">API Key: <button className="mt-1 p-2 bg-green-500 text-white rounded-md hover:bg-green-700">Generate Key</button></p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-2">Connected Accounts</h2>
<<<<<<< .merge_file_T51SJN
{/* // @todo: Create an endpoint for managing connected accounts */}
{/* Connected accounts management */}
=======
        {/* Connected accounts management */}
>>>>>>> .merge_file_SWkZid
        <p className="text-gray-700 dark:text-gray-300">Placeholder for connected accounts.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Delete Account</h2>
<<<<<<< .merge_file_T51SJN
{/* // @todo: Create an endpoint for account deletion */}
{/* Delete account functionality */}
=======
        {/* Delete account functionality */}
>>>>>>> .merge_file_SWkZid
        <p className="text-gray-700 dark:text-gray-300">Placeholder for delete account.</p>
      </div>
    </div>
  );
}
