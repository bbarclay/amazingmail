'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

const CreateDomain = () => {
  const router = useRouter();
  const [form, setForm] = useState<{ domainName: string; verificationMethod: string }>({
    domainName: '',
    verificationMethod: '',
  });
  const [errors, setErrors] = useState<{ domainName?: string; verificationMethod?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const validate = (): { domainName?: string; verificationMethod?: string } => {
    const newErrors: { domainName?: string; verificationMethod?: string } = {};
    if (!form.domainName) newErrors.domainName = 'Domain name is required';
    if (!form.verificationMethod) newErrors.verificationMethod = 'Verification method is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Submit form data to API
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Add New Domain</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>Domain Name</label>
          <input type='text' name='domainName' value={form.domainName} onChange={handleChange} required className='w-full border px-2 py-1' />
          {errors.domainName && <p className='text-red-500 text-sm'>{errors.domainName}</p>}
        </div>
        <div>
          <label className='block mb-1'>Verification Method</label>
          <select name='verificationMethod' value={form.verificationMethod} onChange={handleChange} required className='w-full border px-2 py-1'>
            <option value=''>Select Method</option>
            <option value='TXT'>TXT Record</option>
            <option value='CNAME'>CNAME</option>
          </select>
          {errors.verificationMethod && <p className='text-red-500 text-sm'>{errors.verificationMethod}</p>}
        </div>
        <div className='flex space-x-2'>
          <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>Add Domain</button>
          <button type='button' onClick={() => router.back()} className='bg-gray-500 text-white px-4 py-2 rounded'>Back</button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateDomain;

