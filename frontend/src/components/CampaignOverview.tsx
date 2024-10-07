import React from 'react';

const CampaignOverview: React.FC = () => {
  // Mock data - replace with actual data fetching logic
  const campaigns = [
    { id: 1, name: 'Summer Sale', status: 'Active', sentEmails: 1000, openRate: '25%' },
    { id: 2, name: 'New Product Launch', status: 'Scheduled', sentEmails: 0, openRate: 'N/A' },
    { id: 3, name: 'Customer Feedback', status: 'Completed', sentEmails: 500, openRate: '40%' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
      <ul className="divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-500">
                  Status: {campaign.status} | Sent: {campaign.sentEmails} | Open Rate: {campaign.openRate}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignOverview;

