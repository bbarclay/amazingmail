'use client';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '../../../components/Layout';
import ConfirmModal from '../../../components/ConfirmModal';
import { useRouter } from 'next/navigation';

const ManageEmailAccounts = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<{ id: number; email: string; provider: string; status: 'Active' | 'Inactive' }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{ id: number; email: string; provider: string; status: string } | null>(null);

  useEffect(() => {
    // Fetch email accounts from API (replace with actual API call)
    const fetchAccounts = async () => {
      const mockAccounts = [
        { id: 1, email: 'user1@example.com', provider: 'Gmail', status: 'Active' },
        { id: 2, email: 'user2@mycompany.org', provider: 'Outlook', status: 'Inactive' },
      ];
      setAccounts(mockAccounts);
    };

    fetchAccounts();
  }, []);

  const handleDelete = (account: { id: number; email: string; provider: string; status: string }) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    if (selectedAccount) {
      // Implement deletion logic here, e.g., call API to delete account
      setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
      setSelectedAccount(null);
    }
  };

  const handleAddAccount = () => {
    router.push('/email-accounts/setup');
  };

  const handleGenerate = () => {
    router.push('/email-accounts/generate');
  };

  const handleImportBulk = () => {
    router.push('/email-accounts/import-bulk');
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Manage Email Accounts</h1>
      <div className='mb-4 flex space-x-2'>
        <button onClick={handleAddAccount} className='bg-blue-500 text-white px-4 py-2 rounded'>Add New Account</button>
        <button onClick={handleGenerate} className='bg-green-500 text-white px-4 py-2 rounded'>Generate Accounts</button>
        <button onClick={handleImportBulk} className='bg-purple-500 text-white px-4 py-2 rounded'>Import Bulk</button>
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2'>Email Address</th>
            <th className='py-2'>Provider</th>
            <th className='py-2'>Status</th>
            <th className='py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.id} className='text-center'>
                <td className='py-2'>{account.email}</td>
                <td className='py-2'>{account.provider}</td>
                <td
                  className={clsx('py-2', {
                    'text-green-500': account.status === 'Active',
                    'text-gray-500': account.status === 'Inactive',
                  })}
                >
                  {account.status}
                </td>
                <td className='py-2'>
                  <button className='mr-2 text-blue-500' onClick={() => router.push(`/email-accounts/${account.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(account)} className='text-red-500'>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className='py-4 text-center text-gray-500'>
                No accounts available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={isModalOpen}
        title='Confirm Removal'
        message={`Are you sure you want to remove the account ${selectedAccount?.email}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default ManageEmailAccounts;
