"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      // Assuming the user's first name is stored in the user metadata
      // If it's not, you might need to fetch it from your database
      setFirstName(user.user_metadata?.first_name || '');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div>
      <h1>Welcome to the Dashboard, {firstName}!</h1>
      {/* Your existing dashboard code here */}
    </div>
  );
};

export default DashboardPage;

