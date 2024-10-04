'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Layout from '../../../../components/Layout';
import ConfirmModal from '../../../../components/ConfirmModal';

// Define the type for campaign data
interface CampaignType {
  id: number;
  name: string;
  status: 'Active' | 'Paused' | 'Completed'; // Union type for status
  dateCreated: string;
}

const CampaignsAll = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]); // Use CampaignType[] as state type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(null); // Allow null value

  useEffect(() => {
    // Fetch campaigns from API later (example of setting state)
    const fetchCampaigns = async () => {
      const mockCampaigns: CampaignType[] = [
        { id: 1, name: 'Campaign 1', status: 'Active', dateCreated: '2023-10-03' },
        { id: 2, name: 'Campaign 2', status: 'Paused', dateCreated: '2023-09-28' },
      ];
      setCampaigns(mockCampaigns);
    };
    fetchCampaigns();
  }, []);

  const handleDelete = (campaign: CampaignType) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    if (selectedCampaign) {
      // Perform deletion logic here, e.g., call API to delete campaign
      setCampaigns(campaigns.filter((c) => c.id !== selectedCampaign.id));
      setSelectedCampaign(null);
    }
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

      {/* Confirm Modal */}
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
