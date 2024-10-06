'use client';
import React, { useState } from 'react';

interface AiPrompt {
  name: string;
  content: string;
}

interface AiPromptManagerProps {
  aiPrompts: AiPrompt[];
  setAiPrompts: React.Dispatch<React.SetStateAction<AiPrompt[]>>;
  onClose: () => void;
}

const AiPromptManager: React.FC<AiPromptManagerProps> = ({ aiPrompts, setAiPrompts, onClose }) => {
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');

// @todo: Create an endpoint to save the new prompt
const handleAddPrompt = () => {
    if (newPromptName.trim() !== '' && newPromptContent.trim() !== '') {
      setAiPrompts([...aiPrompts, { name: newPromptName, content: newPromptContent }]);
      setNewPromptName('');
      setNewPromptContent('');
    }
  };

// @todo: Create an endpoint to delete a prompt
const handleDeletePrompt = (index: number) => {
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
