// src/components/AnalyticsDashboard.tsx
'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for the bar chart
const barChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Emails Sent',
      data: [1200, 1900, 3000, 5000, 2300, 3400, 2800],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Emails Opened',
      data: [900, 1500, 2500, 4000, 1800, 3100, 2500],
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
};

// Options for the bar chart
const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Email Campaign Analytics',
    },
  },
};

const AnalyticsDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h2>

      {/* Email Campaign Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Email Campaign Performance</h3>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Email Sent Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Total Emails Sent</h3>
          <p className="mt-2 text-3xl font-bold text-gray-700 dark:text-white">25,000</p>
        </div>

        {/* Open Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Open Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-700 dark:text-white">62%</p>
        </div>

        {/* Click Rate Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Click Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-700 dark:text-white">24%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
