'use client';
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';

const ImportLeads = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (file) {
      setImporting(true);
      // Handle file upload and import leads
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Import Leads</h1>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Select CSV File</label>
          <input type='file' accept='.csv' onChange={handleFileChange} className='w-full' />
        </div>
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
        >
          {importing ? 'Importing...' : 'Import Leads'}
        </button>
      </div>
    </Layout>
  );
};

export default ImportLeads;

