'use client';
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';

const ImportBulkEmailAccounts = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (file) {
      setImporting(true);
      // Handle file upload and import email accounts
    }
  };

  const exampleCSV = 'email,password,imapHost,imapPort,smtpHost,smtpPort,encryption\nuser1@example.com,password123,imap.example.com,993,smtp.example.com,465,SSL';

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Import Email Accounts in Bulk</h1>
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-bold mb-2'>Example CSV Format</h2>
          <pre className='bg-gray-100 p-2 rounded'>
{}
          </pre>
        </div>
        <div>
          <label className='block mb-1'>Select CSV File</label>
          <input type='file' accept='.csv' onChange={handleFileChange} className='w-full' />
        </div>
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
        >
          {importing ? 'Importing...' : 'Import Accounts'}
        </button>
      </div>
    </Layout>
  );
};

export default ImportBulkEmailAccounts;

