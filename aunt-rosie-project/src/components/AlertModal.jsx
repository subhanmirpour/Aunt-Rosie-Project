import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AlertModal({ isOpen, onClose, title, message, confirmText = 'OK', onConfirm, showCancel = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-rose-600" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 