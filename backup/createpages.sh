#!/bin/bash

# Function to write content to a file
write_file() {
  local filepath="$1"
  shift
  mkdir -p "$(dirname "$filepath")"
  cat > "$filepath" <<EOF
$@
EOF
  if [ $? -ne 0 ]; then
    echo "Error writing to $filepath"
  else
    echo "Successfully wrote to $filepath"
  fi
}

# Assuming you are running this script from within src/app

# Create the 'campaigns/templates/create/page.tsx' with the required UI

write_file "campaigns/templates/create/page.tsx" \
"'use client';
import React, { useState } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/navigation';

const CreateEmailTemplate = () => {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  
  const [aiPrompts, setAiPrompts] = useState([]);
  const [spintaxTemplates, setSpintaxTemplates] = useState([]);
  
  const [selectedAiPrompt, setSelectedAiPrompt] = useState('');
  const [selectedSpintax, setSelectedSpintax] = useState('');
  
  const [showAiPromptManager, setShowAiPromptManager] = useState(false);
  const [showSpintaxManager, setShowSpintaxManager] = useState(false);

  const handleAddAiPrompt = () => {
    setTemplateContent(templateContent + \`\${selectedAiPrompt}\`);
  };

  const handleAddSpintax = () => {
    setTemplateContent(templateContent + \`\${selectedSpintax}\`);
  };

  const handleSaveTemplate = () => {
    // Logic to save the email template
  };
  
  return (
    <Layout>
      <h1 className='text-2xl font-bold mb-4'>Create Email Template</h1>
      <div className='space-y-4'>
        <div>
          <label className='block mb-1'>Template Name</label>
          <input
            type='text'
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className='w-full border px-2 py-1'
          />
        </div>
        <div>
          <label className='block mb-1'>Template Content</label>
          <textarea
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            className='w-full border px-2 py-1 h-64'
          ></textarea>
        </div>
        <div className='flex space-x-4'>
          <div>
            <label className='block mb-1'>AI Prompts</label>
            <div className='flex items-center'>
              <select
                value={selectedAiPrompt}
                onChange={(e) => setSelectedAiPrompt(e.target.value)}
                className='border px-2 py-1'
              >
                <option value=''>Select AI Prompt</option>
                {aiPrompts.map((prompt, index) => (
                  <option key={index} value={\`{ai:\${prompt.name}}\`}>
                    {prompt.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddAiPrompt} className='ml-2 bg-blue-500 text-white px-4 py-2 rounded'>
                Add
              </button>
              <button onClick={() => setShowAiPromptManager(true)} className='ml-2 bg-gray-500 text-white px-4 py-2 rounded'>
                Manage Prompts
              </button>
            </div>
          </div>
          <div>
            <label className='block mb-1'>Spintax Templates</label>
            <div className='flex items-center'>
              <select
                value={selectedSpintax}
                onChange={(e) => setSelectedSpintax(e.target.value)}
                className='border px-2 py-1'
              >
                <option value=''>Select Spintax</option>
                {spintaxTemplates.map((spintax, index) => (
                  <option key={index} value={\`{spintax:\${spintax.name}}\`}>
                    {spintax.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddSpintax} className='ml-2 bg-blue-500 text-white px-4 py-2 rounded'>
                Add
              </button>
              <button onClick={() => setShowSpintaxManager(true)} className='ml-2 bg-gray-500 text-white px-4 py-2 rounded'>
                Manage Spintax
              </button>
            </div>
          </div>
        </div>
        <div className='flex space-x-2'>
          <button onClick={handleSaveTemplate} className='bg-green-500 text-white px-4 py-2 rounded'>
            Save Template
          </button>
          <button onClick={() => router.back()} className='bg-gray-500 text-white px-4 py-2 rounded'>
            Cancel
          </button>
        </div>
      </div>

      {/* AI Prompt Manager Modal */}
      {showAiPromptManager && (
        <AiPromptManager
          aiPrompts={aiPrompts}
          setAiPrompts={setAiPrompts}
          onClose={() => setShowAiPromptManager(false)}
        />
      )}

      {/* Spintax Manager Modal */}
      {showSpintaxManager && (
        <SpintaxManager
          spintaxTemplates={spintaxTemplates}
          setSpintaxTemplates={setSpintaxTemplates}
          onClose={() => setShowSpintaxManager(false)}
        />
      )}
    </Layout>
  );
};

export default CreateEmailTemplate;
"

# Create AiPromptManager component
cd ../../components

write_file "AiPromptManager.tsx" \
"'use client';
import React, { useState } from 'react';

const AiPromptManager = ({ aiPrompts, setAiPrompts, onClose }) => {
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');

  const handleAddPrompt = () => {
    if (newPromptName.trim() !== '' && newPromptContent.trim() !== '') {
      setAiPrompts([...aiPrompts, { name: newPromptName, content: newPromptContent }]);
      setNewPromptName('');
      setNewPromptContent('');
    }
  };

  const handleDeletePrompt = (index) => {
    const updatedPrompts = aiPrompts.filter((_, i) => i !== index);
    setAiPrompts(updatedPrompts);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded p-6 w-1/2'>
        <h2 className='text-xl font-bold mb-4'>Manage AI Prompts</h2>
        <div className='mb-4'>
          <label className='block mb-1'>Prompt Name</label>
          <input
            type='text'
            value={newPromptName}
            onChange={(e) => setNewPromptName(e.target.value)}
            placeholder='Enter prompt name'
            className='w-full border px-2 py-1 mb-2'
          />
          <label className='block mb-1'>Prompt Content</label>
          <textarea
            value={newPromptContent}
            onChange={(e) => setNewPromptContent(e.target.value)}
            placeholder='Enter AI prompt content'
            className='w-full border px-2 py-1 h-24'
          ></textarea>
          <button onClick={handleAddPrompt} className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'>
            Add Prompt
          </button>
        </div>
        <ul className='mb-4'>
          {aiPrompts.map((prompt, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{prompt.name}</span>
              <button onClick={() => handleDeletePrompt(index)} className='text-red-500'>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className='flex justify-end'>
          <button onClick={onClose} className='bg-gray-500 text-white px-4 py-2 rounded'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPromptManager;
"

# Create SpintaxManager component

write_file "SpintaxManager.tsx" \
"'use client';
import React, { useState } from 'react';

const SpintaxManager = ({ spintaxTemplates, setSpintaxTemplates, onClose }) => {
  const [newSpintaxName, setNewSpintaxName] = useState('');
  const [newSpintaxContent, setNewSpintaxContent] = useState('');

  const handleAddSpintax = () => {
    if (newSpintaxName.trim() !== '' && newSpintaxContent.trim() !== '') {
      setSpintaxTemplates([...spintaxTemplates, { name: newSpintaxName, content: newSpintaxContent }]);
      setNewSpintaxName('');
      setNewSpintaxContent('');
    }
  };

  const handleDeleteSpintax = (index) => {
    const updatedSpintax = spintaxTemplates.filter((_, i) => i !== index);
    setSpintaxTemplates(updatedSpintax);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded p-6 w-1/2'>
        <h2 className='text-xl font-bold mb-4'>Manage Spintax Templates</h2>
        <div className='mb-4'>
          <label className='block mb-1'>Spintax Name</label>
          <input
            type='text'
            value={newSpintaxName}
            onChange={(e) => setNewSpintaxName(e.target.value)}
            placeholder='Enter spintax name'
            className='w-full border px-2 py-1 mb-2'
          />
          <label className='block mb-1'>Spintax Content</label>
          <textarea
            value={newSpintaxContent}
            onChange={(e) => setNewSpintaxContent(e.target.value)}
            placeholder='Enter spintax content'
            className='w-full border px-2 py-1 h-24'
          ></textarea>
          <button onClick={handleAddSpintax} className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'>
            Add Spintax
          </button>
        </div>
        <ul className='mb-4'>
          {spintaxTemplates.map((spintax, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{spintax.name}</span>
              <button onClick={() => handleDeleteSpintax(index)} className='text-red-500'>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className='flex justify-end'>
          <button onClick={onClose} className='bg-gray-500 text-white px-4 py-2 rounded'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpintaxManager;
"

# Return to src/app/campaigns/templates directory
cd ../app/campaigns/templates

# Update the templates/page.tsx to include a link to create new templates

write_file "page.tsx" \
"'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import ConfirmModal from '../../../../components/ConfirmModal';

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
          {templates.map((template) => (
            <tr key={template.id} className='text-center'>
              <td className='py-2'>{template.name}</td>
              <td className='py-2'>
                <Link
                  href={\`/campaigns/templates/\${template.id}/edit\`}
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
        message={\`Are you sure you want to delete the template \${selectedTemplate?.name}?\`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Templates;
"

echo "UI pages and components for creating email templates with AI and Spintax functionality have been successfully created and updated."
