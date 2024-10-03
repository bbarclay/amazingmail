'use client';
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '../../../components/Layout';
import ConfirmModal from '../../../components/ConfirmModal';

const CampaignsAll = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    // Fetch campaigns from API later
  }, []);

  const handleDelete = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    // Delete campaign via API
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>All Campaigns</h1>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2'>Campaign Name</th>
            <th className='py-2'>Status</th>
            <th className='py-2'>Date Created</th>
            <th className='py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className='text-center'>
              <td className='py-2'>
                <Link href={`/campaigns/${campaign.id}/details`} className='text-blue-500'>
                  {campaign.name}
                </Link>
              </td>
              <td
                className={clsx('py-2', {
                  'text-green-500': campaign.status === 'Active',
                  'text-yellow-500': campaign.status === 'Paused',
                  'text-gray-500': campaign.status === 'Completed',
                })}
              >
                {campaign.status}
              </td>
              <td className='py-2'>{campaign.dateCreated}</td>
              <td className='py-2'>
                <Link href={`/campaigns/${campaign.id}/edit`} className='mr-2 text-blue-500'>
                  Edit
                </Link>
                <button onClick={() => handleDelete(campaign)} className='text-red-500'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href='/campaigns/create' className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'>
        Create New Campaign
      </Link>

      <ConfirmModal
        isOpen={isModalOpen}
        title='Confirm Deletion'
        message={`Are you sure you want to delete the campaign ${selectedCampaign?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default CampaignsAll;

