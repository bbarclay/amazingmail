import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/Uskeleton';
import DashboardCard from '@/components/DashboardCard';

const DashboardContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <DashboardCard title="Emails Sent" value="1,234" />
            <DashboardCard title="Open Rate" value="45%" />
            <DashboardCard title="Click Rate" value="12%" />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
