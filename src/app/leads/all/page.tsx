'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';

const AllLeads = () => {
  const router = useRouter();
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Fetch leads from API
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
        <button onClick={handleImport} className='bg-blue-500 text-white px-4 py-2 rounded'>Import Leads</button>
        <button onClick={handleSegment} className='bg-green-500 text-white px-4 py-2 rounded'>Segment Leads</button>
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
          {leads.map((lead) => (
            <tr key={lead.id} className='text-center'>
              <td className='py-2'>{lead.name}</td>
              <td className='py-2'>{lead.email}</td>
              <td className='py-2'>{lead.company}</td>
              <td className='py-2'>{lead.status}</td>
              <td className='py-2'>
                <button className='mr-2 text-blue-500' onClick={() => router.push(`/leads/${lead.id}/edit`)}>Edit</button>
                <button className='text-red-500'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default AllLeads;

