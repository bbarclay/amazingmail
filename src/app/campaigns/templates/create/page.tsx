'use client';
import React, { useState } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/navigation';
import AiPromptManager from '../../../../components/AiPromptManager';
import SpintaxManager from '../../../../components/SpintaxManager';

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
    setTemplateContent(templateContent + `${selectedAiPrompt}`);
  };

  const handleAddSpintax = () => {
    setTemplateContent(templateContent + `${selectedSpintax}`);
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
                  <option key={index} value={`{ai:${prompt.name}}`}>
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
                  <option key={index} value={`{spintax:${spintax.name}}`}>
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