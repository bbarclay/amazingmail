'use client';
import React, { useState } from 'react';
import Layout from '../../../components/Layout';

const ImportLeads = () => {
  const [file, setFile] = useState<File | null>(null); // State to hold the selected file
  const [importing, setImporting] = useState(false); // State to manage importing status

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Set the selected file
    } else {
      setFile(null); // Reset file state if no file is selected
    }
  };

  const handleImport = async () => {
    if (file) {
      setImporting(true); // Set importing status to true
      try {
<<<<<<< .merge_file_Oxlhfp
// @todo: Create an endpoint for importing leads from a CSV file
// Handle file upload and import leads
=======
        // Handle file upload and import leads
>>>>>>> .merge_file_lhzwyR
        console.log('Importing file:', file.name);
        // Simulate file import process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Reset file input after import
        setFile(null);
      } catch (error) {
        console.error('Error importing leads:', error); // Log any errors
      } finally {
        setImporting(false); // Reset importing status
      }
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Import Leads</h1>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Select CSV File</label>
          <input 
            type='file' 
            accept='.csv' 
            onChange={handleFileChange} 
            className='w-full' 
          />
        </div>
        <button
          onClick={handleImport}
          disabled={!file || importing} // Disable button if no file or importing
          aria-busy={importing} // Add aria-busy for accessibility
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
        >
          {importing ? 'Importing...' : 'Import Leads'}
        </button>
      </div>
    </Layout>
  );
};

export default ImportLeads;
