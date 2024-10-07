'use client';

import React, { useState } from 'react';

export default function AccountSettings() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // @todo: Replace with actual API endpoint
      const response = await fetch('/api/v1/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle successful upload
        console.log('Image uploaded successfully');
      } else {
        // Handle error
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-2">Profile Information</h2>
        <div className="mb-4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
          <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleImageUpload} className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          {selectedImage && (
            <div className="mt-2">
              <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Upload Image</button>
            </div>
          )}
        </div>
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
        <p className="text-gray-700 dark:text-gray-300">API Key: <button className="mt-1 p-2 bg-green-500 text-white rounded-md hover:bg-green-700">Generate Key</button></p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-medium mb-2">Connected Accounts</h2>
        <p className="text-gray-700 dark:text-gray-300">Placeholder for connected accounts.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Delete Account</h2>
        <p className="text-gray-700 dark:text-gray-300">Placeholder for delete account.</p>
      </div>
    </div>
  );
}

