'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';

const GenerateEmailAccounts = () => {
  // Define the state for managing domains and form inputs
  const [domains, setDomains] = useState<{ id: number; name: string }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [accountPrefix, setAccountPrefix] = useState('');
  const [numberOfAccounts, setNumberOfAccounts] = useState(1);
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Mock API call to get domains (replace with real API call)
    const fetchDomains = async () => {
      // Example mock domains data
      const mockDomains = [
        { id: 1, name: 'example.com' },
        { id: 2, name: 'mycompany.org' },
      ];
      setDomains(mockDomains);
    };
    
    fetchDomains();
  }, []);

  const handleGenerate = async () => {
    if (selectedDomain && accountPrefix && numberOfAccounts > 0) {
      setCreating(true);
      try {
        // Example API call to generate email accounts (replace with real API call)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Accounts generated successfully');
        // Redirect or update UI based on the result
      } catch (error) {
        console.error('Failed to generate accounts:', error);
      } finally {
        setCreating(false);
      }
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Generate Email Accounts</h1>
      <div className='space-y-4'>
        {/* Domain Selection */}
        <div>
          <label className='block mb-1'>Select Domain</label>
          <select
            name='domain'
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className='w-full border px-2 py-1'
          >
            <option value=''>Select Domain</option>
            {domains.length > 0 ? (
              domains.map((domain) => (
                <option key={domain.id} value={domain.name}>
                  {domain.name}
                </option>
              ))
            ) : (
              <option disabled>No domains available</option>
            )}
          </select>
        </div>

        {/* Account Prefix Input */}
        <div>
          <label className='block mb-1'>Account Prefix</label>
          <input
            type='text'
            value={accountPrefix}
            onChange={(e) => setAccountPrefix(e.target.value)}
            className='w-full border px-2 py-1'
            placeholder='e.g., user'
          />
        </div>

        {/* Number of Accounts Input */}
        <div>
          <label className='block mb-1'>Number of Accounts</label>
          <input
            type='number'
            value={numberOfAccounts}
            onChange={(e) => setNumberOfAccounts(Number(e.target.value))}
            className='w-full border px-2 py-1'
            min='1'
          />
        </div>

        {/* Password Input */}
        <div>
          <label className='block mb-1'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border px-2 py-1'
            placeholder='Password for generated accounts'
          />
        </div>

        {/* Generate Accounts Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedDomain || !accountPrefix || !password || creating}
          className='bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
        >
          {creating ? 'Generating...' : 'Generate Accounts'}
        </button>
      </div>
    </Layout>
  );
};

export default GenerateEmailAccounts;
