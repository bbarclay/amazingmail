'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

const CreateCampaign = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    subject: '',
    body: '',
    targetAudience: '',
    schedule: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Campaign name is required';
    if (!form.subject) newErrors.subject = 'Email subject is required';
    if (!form.body) newErrors.body = 'Email body is required';
    if (!form.targetAudience) newErrors.targetAudience = 'Target audience is required';
    if (!form.schedule) newErrors.schedule = 'Schedule is required';
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

  const handleReset = () => {
    setForm({
      name: '',
      subject: '',
      body: '',
      targetAudience: '',
      schedule: '',
    });
    setErrors({});
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Create New Campaign</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>Campaign Name</label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
            required
            className='w-full border px-2 py-1'
          />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
        </div>
        <div>
          <label className='block mb-1'>Email Subject</label>
          <input
            type='text'
            name='subject'
            value={form.subject}
            onChange={handleChange}
            required
            className='w-full border px-2 py-1'
          />
          {errors.subject && <p className='text-red-500 text-sm'>{errors.subject}</p>}
        </div>
        <div>
          <label className='block mb-1'>Email Body</label>
          <textarea
            name='body'
            value={form.body}
            onChange={handleChange}
            required
            className='w-full border px-2 py-1 h-32'
          ></textarea>
          {errors.body && <p className='text-red-500 text-sm'>{errors.body}</p>}
        </div>
        <div>
          <label className='block mb-1'>Target Audience</label>
          <select
            name='targetAudience'
            value={form.targetAudience}
            onChange={handleChange}
            required
            className='w-full border px-2 py-1'
          >
            <option value=''>Select Audience</option>
            {/* Populate with existing lists later */}
          </select>
          {errors.targetAudience && <p className='text-red-500 text-sm'>{errors.targetAudience}</p>}
        </div>
        <div>
          <label className='block mb-1'>Scheduling Options</label>
          <input
            type='datetime-local'
            name='schedule'
            value={form.schedule}
            onChange={handleChange}
            required
            className='w-full border px-2 py-1'
          />
          {errors.schedule && <p className='text-red-500 text-sm'>{errors.schedule}</p>}
        </div>
        <div className='flex space-x-2'>
          <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>
            Create
          </button>
          <button type='button' onClick={handleReset} className='bg-gray-500 text-white px-4 py-2 rounded'>
            Reset
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateCampaign;

