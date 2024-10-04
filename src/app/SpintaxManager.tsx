'use client';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface SpintaxTemplate {
  name: string;
  content: string;
}

interface SpintaxManagerProps {
  spintaxTemplates: SpintaxTemplate[];
  setSpintaxTemplates: Dispatch<SetStateAction<SpintaxTemplate[]>>;
  onClose: () => void;
}

const SpintaxManager: React.FC<SpintaxManagerProps> = ({ spintaxTemplates, setSpintaxTemplates, onClose }) => {
  const [newSpintaxName, setNewSpintaxName] = useState('');
  const [newSpintaxContent, setNewSpintaxContent] = useState('');

  const handleAddSpintax = () => {
    if (newSpintaxName.trim() !== '' && newSpintaxContent.trim() !== '') {
      setSpintaxTemplates([...spintaxTemplates, { name: newSpintaxName, content: newSpintaxContent }]);
      setNewSpintaxName('');
      setNewSpintaxContent('');
    }
  };

  const handleDeleteSpintax = (index: number) => {
    const updatedSpintax = spintaxTemplates.filter((_, i) => i !== index);
    setSpintaxTemplates(updatedSpintax);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded p-6 w-1/2'>
        <h2 className='text-xl font-bold mb-4'>Manage Spintax Templates</h2>
        <div className='mb-4'>
          <label className='block mb-1'>Spintax Name</label>
          <input
            type='text'
            value={newSpintaxName}
            onChange={(e) => setNewSpintaxName(e.target.value)}
            placeholder='Enter spintax name'
            className='w-full border px-2 py-1 mb-2'
          />
          <label className='block mb-1'>Spintax Content</label>
          <textarea
            value={newSpintaxContent}
            onChange={(e) => setNewSpintaxContent(e.target.value)}
            placeholder='Enter spintax content'
            className='w-full border px-2 py-1 h-24'
          ></textarea>
          <button onClick={handleAddSpintax} className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'>
            Add Spintax
          </button>
        </div>
        <ul className='mb-4'>
          {spintaxTemplates.map((spintax, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{spintax.name}</span>
              <button onClick={() => handleDeleteSpintax(index)} className='text-red-500'>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className='flex justify-end'>
          <button onClick={onClose} className='bg-gray-500 text-white px-4 py-2 rounded'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpintaxManager;

