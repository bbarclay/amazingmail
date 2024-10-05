'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter, useParams } from 'next/navigation';

const EditLead = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [form, setForm] = useState<{ name: string; email: string; company: string; status: string }>({
    name: '',
    email: '',
    company: '',
    status: '',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (id) {
<<<<<<< .merge_file_3L89zK
// @todo: Create an endpoint to fetch lead data by ID
// Fetch lead data by ID and setForm
=======
      // Fetch lead data by ID and setForm
>>>>>>> .merge_file_5C1vCl
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const validate = (): { name?: string; email?: string } => {
    const newErrors: { name?: string; email?: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    // Additional validations...
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
<<<<<<< .merge_file_3L89zK
// @todo: Create an endpoint to update lead data
// Update lead via API
=======
      // Update lead via API
>>>>>>> .merge_file_5C1vCl
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Edit Lead</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>Name</label>
          <input type='text' name='name' value={form.name} onChange={handleChange} className='w-full border px-2 py-1' />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
        </div>
        <div>
          <label className='block mb-1'>Email</label>
          <input type='email' name='email' value={form.email} onChange={handleChange} className='w-full border px-2 py-1' />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>
        <div>
          <label className='block mb-1'>Company</label>
          <input type='text' name='company' value={form.company} onChange={handleChange} className='w-full border px-2 py-1' />
        </div>
        <div>
          <label className='block mb-1'>Status</label>
          <select name='status' value={form.status} onChange={handleChange} className='w-full border px-2 py-1'>
            <option value=''>Select Status</option>
            <option value='open'>Open</option>
            <option value='contacted'>Contacted</option>
            <option value='qualified'>Qualified</option>
            <option value='unqualified'>Unqualified</option>
          </select>
        </div>
        <div className='flex space-x-2'>
          <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>Save Changes</button>
          <button type='button' onClick={() => router.back()} className='bg-gray-500 text-white px-4 py-2 rounded'>Cancel</button>
        </div>
      </form>
    </Layout>
  );
};

export default EditLead;

