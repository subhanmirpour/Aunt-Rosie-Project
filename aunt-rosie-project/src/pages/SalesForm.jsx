import React from 'react';
import SalesFormContainer from '../components/SalesFormContainer';
import ErrorBoundary from '../components/ErrorBoundary';

export default function SalesForm() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Record Sale</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the sale details below. Add products and quantities as needed.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ErrorBoundary>
          <SalesFormContainer />
        </ErrorBoundary>
      </div>
    </div>
  );
} 