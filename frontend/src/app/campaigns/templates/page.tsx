'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import ConfirmModal from '../../../components/ConfirmModal';

// Type definition for template data (use only if using TypeScript)
interface TemplateType {
  id: number;
  name: string;
}

const Templates = () => {
  // State hooks with type annotations (if using TypeScript)
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  useEffect(() => {
<<<<<<< .merge_file_5hGg2x
// @todo: Create an endpoint to fetch templates from the API
// Fetch templates from API (Replace with real API call)
=======
    // Fetch templates from API (Replace with real API call)
>>>>>>> .merge_file_jfbD3W
    const fetchTemplates = async () => {
      const mockTemplates: TemplateType[] = [
        { id: 1, name: 'Welcome Email' },
        { id: 2, name: 'Discount Offer' },
      ];
      setTemplates(mockTemplates);
    };

    fetchTemplates();
  }, []);

  const handleDelete = (template: TemplateType) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    if (selectedTemplate) {
<<<<<<< .merge_file_5hGg2x
// @todo: Create an endpoint to delete a template
// Implement deletion logic here, e.g., call API to delete template
=======
      // Implement deletion logic here, e.g., call API to delete template
>>>>>>> .merge_file_jfbD3W
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setSelectedTemplate(null);
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Email Templates</h1>
      <div className='mb-4 flex justify-between'>
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
          {templates.length > 0 ? (
            templates.map((template) => (
              <tr key={template.id} className='text-center'>
                <td className='py-2'>{template.name}</td>
                <td className='py-2'>
                  <Link href={`/campaigns/templates/${template.id}/edit`} className='mr-2 text-blue-500'>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(template)} className='text-red-500'>
                    Delete
                  </button>
                  <button className='ml-2 text-green-500'>Preview</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className='py-4 text-center text-gray-500'>
                No templates available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirm Modal for deletion */}
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
