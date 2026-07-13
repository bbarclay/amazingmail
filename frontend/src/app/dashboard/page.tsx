"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      // Assuming the user's first name is stored in the user metadata
      // If it's not, you might need to fetch it from your database
      setFirstName(user.user_metadata?.first_name || user.email?.split('@')[0] || 'User');
    }
  }, [isAuthenticated, user, router, loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome back, {firstName}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards will go here */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Quick Stats
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your email campaigns at a glance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

