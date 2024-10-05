'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    createColumnHelper,
} from '@tanstack/react-table';
import React from 'react';

export default function BillingSettings() {
    const columnHelper = createColumnHelper();

    // Define columns for the billing history table
    const columns = [
        columnHelper.accessor('date', {
            header: 'Date',
            cell: info => info.getValue(),  // Use getValue() instead of renderValue()
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue(),  // Use getValue() instead of renderValue()
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: info => info.getValue(),  // Use getValue() instead of renderValue()
        }),
    ];

    // Sample data for the billing history
    const data = [
        { date: '2024-05-01', description: 'Subscription Fee', amount: '$49.99' },
        { date: '2024-04-01', description: 'Subscription Fee', amount: '$49.99' },
        { date: '2024-03-01', description: 'Subscription Fee', amount: '$49.99' },
    ];

    // Initialize the table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

<<<<<<< .merge_file_HpN3RF
// @todo: Create an endpoint to manage subscription plans
return (
=======
    return (
>>>>>>> .merge_file_vpP6TK
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Billing Settings</h1>

            {/* Subscription Plan Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-medium mb-2">Subscription Plan</h2>
                <p className="text-gray-700 dark:text-gray-300">Current Plan: <strong>[Plan Name]</strong></p>
                <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside mb-2">
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">Price: $[Price]/month</p>
                <button className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Upgrade/Downgrade Plan</button>
            </div>

<<<<<<< .merge_file_HpN3RF
{/* // @todo: Create an endpoint to update payment information */}
{/* Payment Information Section */}
=======
            {/* Payment Information Section */}
>>>>>>> .merge_file_vpP6TK
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-medium mb-2">Payment Information</h2>
                <p className="text-gray-700 dark:text-gray-300">Card Ending In: **** **** **** 1234</p>
                <button className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Update Payment Information</button>
            </div>

<<<<<<< .merge_file_HpN3RF
{/* // @todo: Create an endpoint to fetch billing history */}
{/* Billing History Section */}
=======
            {/* Billing History Section */}
>>>>>>> .merge_file_vpP6TK
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-2">Billing History</h2>
                {/* Table to display billing history */}
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
                                        {cell.getValue() as React.ReactNode}  {/* Change from cell.renderCell() to cell.getValue() */}
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
