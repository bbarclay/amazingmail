'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';

const GenerateEmailAccounts = () => {
  const router = useRouter();
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [accountPrefix, setAccountPrefix] = useState('');
  const [numberOfAccounts, setNumberOfAccounts] = useState(1);
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Fetch user's saved domains from API and setDomains
  }, []);

  const handleGenerate = () => {
    if (selectedDomain && accountPrefix && numberOfAccounts > 0) {
      setCreating(true);
      // Call API to generate email accounts
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Generate Email Accounts</h1>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Select Domain</label>
          <select
            name='domain'
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className='w-full border px-2 py-1'
          >
            <option value=''>Select Domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.name}>
                {domain.name}
              </option>
            ))}
          </select>
        </div>
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
        <button
          onClick={handleGenerate}
          disabled={!selectedDomain || !accountPrefix || creating}
          className='bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400'
        >
          {creating ? 'Generating...' : 'Generate Accounts'}
        </button>
      </div>
    </Layout>
  );
};

export default GenerateEmailAccounts;

