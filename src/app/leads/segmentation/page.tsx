'use client';
import React, { useState } from 'react';
import Layout from '../../../components/Layout';

// Define an interface for the segment
interface Segment {
  id: number;        // Define the id as a number
  name: string;      // Define the name as a string
  criteria: string;  // Define criteria as a string
}

const LeadSegmentation = () => {
  const [segments, setSegments] = useState<Segment[]>([]); // Type the segments state
  const [newSegmentName, setNewSegmentName] = useState('');
  const [criteria, setCriteria] = useState('');

  const handleCreateSegment = () => {
    // Implement the logic to create a new segment using newSegmentName and criteria
    const newSegment: Segment = {
      id: segments.length + 1, // Example ID generation logic
      name: newSegmentName,
      criteria: criteria,
    };
    
    setSegments([...segments, newSegment]); // Update segments with the new segment
    console.log('Creating segment:', newSegment);
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
