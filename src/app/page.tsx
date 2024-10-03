'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import DashboardContent from '@/components/DashboardContent';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-auto">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          <DashboardContent />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
