'use client';
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded p-6 w-96'>
        <h2 className='text-xl font-bold mb-4'>{title}</h2>
        <p className='mb-6'>{message}</p>
        <div className='flex justify-end space-x-2'>
          <button onClick={onCancel} className='bg-gray-500 text-white px-4 py-2 rounded'>Cancel</button>
          <button onClick={onConfirm} className='bg-red-500 text-white px-4 py-2 rounded'>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

