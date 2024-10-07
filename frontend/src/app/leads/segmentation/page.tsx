'use client';
import React, { useState } from 'react';
import Layout from '../../../components/Layout';

const LeadSegmentation = () => {
  const [segments] = useState([]); // Removed `setSegments` as it's not used
  const [newSegmentName, setNewSegmentName] = useState('');
  const [criteria, setCriteria] = useState('');

  const handleCreateSegment = () => {
// @todo: Create an endpoint for adding a new segment
// Implement the logic to create a new segment using newSegmentName and criteria
    console.log('Creating segment:', newSegmentName, criteria);
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Lead Segmentation</h1>
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-bold mb-2'>Existing Segments</h2>
          <ul>
            {segments.map((segment) => (
              <li key={segment.id} className='mb-2'>
                <span className='font-bold'>{segment.name}</span> - {segment.criteria}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className='text-xl font-bold mb-2'>Create New Segment</h2>
          <div className='mb-2'>
            <label className='block mb-1'>Segment Name</label>
            <input
              type='text'
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
              className='w-full border px-2 py-1'
            />
          </div>
          <div className='mb-2'>
            <label className='block mb-1'>Criteria</label>
            <input
              type='text'
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className='w-full border px-2 py-1'
              placeholder='e.g., status: open, company size: >50'
            />
          </div>
          <button onClick={handleCreateSegment} className='bg-green-500 text-white px-4 py-2 rounded'>
            Create Segment
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LeadSegmentation;
