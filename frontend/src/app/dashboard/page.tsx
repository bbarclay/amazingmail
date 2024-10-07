"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {/* Your existing dashboard code here */}
    </div>
  );
};

export default DashboardPage;
