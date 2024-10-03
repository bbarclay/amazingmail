'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Layout from '../../../components/Layout';
import ConfirmModal from '../../../components/ConfirmModal';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    // Fetch templates from API later
  }, []);

  const handleDelete = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    // Delete template via API
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Email Templates</h1>
      <div className='mb-4'>
        <Link href='/campaigns/templates/create' className='bg-blue-500 text-white px-4 py-2 rounded'>
          Create New Template
        </Link>
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2'>Template Name</th>
            <th className='py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id} className='text-center'>
              <td className='py-2'>{template.name}</td>
              <td className='py-2'>
                <Link
                  href={`/campaigns/templates/${template.id}/edit`}
                  className='mr-2 text-blue-500'
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(template)} className='text-red-500'>
                  Delete
                </button>
                <button className='ml-2 text-green-500'>Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={isModalOpen}
        title='Confirm Deletion'
        message={`Are you sure you want to delete the template ${selectedTemplate?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Templates;
