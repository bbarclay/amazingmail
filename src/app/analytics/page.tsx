'use client';

import React from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/react-table';

export default function Analytics() {
  const columnHelper = createColumnHelper();

  // Define columns for the analytics table
  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),  // Use getValue() instead of renderValue()
    }),
    columnHelper.accessor('sent', {
      header: 'Sent',
      cell: info => info.getValue() ? 'Yes' : 'No',  // Render boolean values as "Yes" or "No"
    }),
    columnHelper.accessor('opened', {
      header: 'Opened',
      cell: info => info.getValue() ? 'Yes' : 'No',  // Render boolean values as "Yes" or "No"
    }),
    columnHelper.accessor('clicked', {
      header: 'Clicked',
      cell: info => info.getValue() ? 'Yes' : 'No',  // Render boolean values as "Yes" or "No"
    }),
  ];

  // Sample data for the analytics table
  const data = [
    { email: 'test1@example.com', sent: true, opened: true, clicked: false },
    { email: 'test2@example.com', sent: true, opened: false, clicked: false },
    { email: 'test3@example.com', sent: true, opened: true, clicked: true },
  ];

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div>
          {/* Placeholder for a date range picker component */}
          <p className="text-gray-700 dark:text-gray-300">Date Range Picker Placeholder</p>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">Emails Sent</p>
          <p className="text-2xl font-bold">12,345</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">Open Rate</p>
          <p className="text-2xl font-bold">25%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">Click-Through Rate</p>
          <p className="text-2xl font-bold">5%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-bold">2%</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8">
        <p className="text-gray-700 dark:text-gray-300">Chart Placeholder</p>
        {/* Replace with actual chart component */}
      </div>

      {/* Billing History Table Section */}
      <div className="mt-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border border-gray-300 px-4 py-2 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border border-gray-300 px-4 py-2">
                    {cell.getValue()}  {/* Change from cell.renderCell() to cell.getValue() */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
