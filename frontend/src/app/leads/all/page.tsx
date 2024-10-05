'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';

// Define a type for Lead if using TypeScript
interface LeadType {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
}

const AllLeads = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadType[]>([]); // State type definition

  useEffect(() => {
<<<<<<< .merge_file_6P70GL
// @todo: Create an endpoint to fetch leads from the API
// Fetch leads from API (replace with actual API call)
=======
    // Fetch leads from API (replace with actual API call)
>>>>>>> .merge_file_eYLpH4
    const fetchLeads = async () => {
      // Example mock data
      const mockLeads: LeadType[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Example Inc.', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Smith Co.', status: 'Inactive' },
      ];
      setLeads(mockLeads);
    };

    fetchLeads();
  }, []);

  const handleImport = () => {
    router.push('/leads/import');
  };

  const handleSegment = () => {
    router.push('/leads/segmentation');
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>All Leads</h1>
      <div className='mb-4 flex space-x-2'>
        <button onClick={handleImport} className='bg-blue-500 text-white px-4 py-2 rounded' aria-label="Import Leads">
          Import Leads
        </button>
        <button onClick={handleSegment} className='bg-green-500 text-white px-4 py-2 rounded' aria-label="Segment Leads">
          Segment Leads
        </button>
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2'>Name</th>
            <th className='py-2'>Email</th>
            <th className='py-2'>Company</th>
            <th className='py-2'>Status</th>
            <th className='py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id} className='text-center'>
                <td className='py-2'>{lead.name}</td>
                <td className='py-2'>{lead.email}</td>
                <td className='py-2'>{lead.company}</td>
                <td className='py-2'>{lead.status}</td>
                <td className='py-2'>
                  <button 
                    className='mr-2 text-blue-500' 
                    onClick={() => router.push(`/leads/${lead.id}/edit`)} 
                    aria-label={`Edit lead ${lead.name}`}
                  >
                    Edit
                  </button>
                  <button className='text-red-500' aria-label={`Delete lead ${lead.name}`}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className='py-4 text-center text-gray-500'>
                No leads available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default AllLeads;
