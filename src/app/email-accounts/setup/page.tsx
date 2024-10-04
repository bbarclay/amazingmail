'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

const SetupEmailAccount = () => {
  const router = useRouter();
  const [form, setForm] = useState<{ email: string; password: string; provider: string; imapHost: string; imapPort: string; smtpHost: string; smtpPort: string; encryption: string }>({
    email: '',
    password: '',
    provider: '',
    imapHost: '',
    imapPort: '',
    smtpHost: '',
    smtpPort: '',
    encryption: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; provider?: string }>({});

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email address is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.provider) newErrors.provider = 'Provider is required';
    // Additional validations...
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
      <h1 className='text-2xl font-bold mb-4'>Setup Email Account</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>Email Address</label>
          <input type='email' name='email' value={form.email} onChange={handleChange} required className='w-full border px-2 py-1' />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>
        <div>
          <label className='block mb-1'>Password</label>
          <input type='password' name='password' value={form.password} onChange={handleChange} required className='w-full border px-2 py-1' />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
        </div>
        <div>
          <label className='block mb-1'>Provider</label>
          <select name='provider' value={form.provider} onChange={handleChange} required className='w-full border px-2 py-1'>
            <option value=''>Select Provider</option>
            <option value='gmail'>Gmail</option>
            <option value='outlook'>Outlook</option>
            <option value='exchange'>Exchange</option>
            <option value='other'>Other</option>
          </select>
          {errors.provider && <p className='text-red-500 text-sm'>{errors.provider}</p>}
        </div>
        {form.provider === 'other' && (
          <>
            <div>
              <label className='block mb-1'>IMAP Host</label>
              <input type='text' name='imapHost' value={form.imapHost} onChange={handleChange} className='w-full border px-2 py-1' />
            </div>
            <div>
              <label className='block mb-1'>IMAP Port</label>
              <input type='number' name='imapPort' value={form.imapPort} onChange={handleChange} className='w-full border px-2 py-1' />
            </div>
            <div>
              <label className='block mb-1'>SMTP Host</label>
              <input type='text' name='smtpHost' value={form.smtpHost} onChange={handleChange} className='w-full border px-2 py-1' />
            </div>
            <div>
              <label className='block mb-1'>SMTP Port</label>
              <input type='number' name='smtpPort' value={form.smtpPort} onChange={handleChange} className='w-full border px-2 py-1' />
            </div>
          </>
        )}
        <div>
          <label className='block mb-1'>Encryption</label>
          <select name='encryption' value={form.encryption} onChange={handleChange} className='w-full border px-2 py-1'>
            <option value=''>Select Encryption</option>
            <option value='ssl'>SSL</option>
            <option value='tls'>TLS</option>
            <option value='none'>None</option>
          </select>
        </div>
        <div className='flex space-x-2'>
          <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>Save & Test</button>
          <button type='button' onClick={() => router.back()} className='bg-gray-500 text-white px-4 py-2 rounded'>Back</button>
        </div>
      </form>
    </Layout>
  );
};

export default SetupEmailAccount;

