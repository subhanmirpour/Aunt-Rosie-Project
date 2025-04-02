import React from 'react';
import SalesFormContainer from '../components/SalesFormContainer';
import ErrorBoundary from '../components/ErrorBoundary';

export default function SalesForm() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-rose-700">Record Sale</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the sale details below. Add products and quantities as needed.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ErrorBoundary>
          <SalesFormContainer />
        </ErrorBoundary>
      </div>

      <style>
        {`
          .react-select-container .react-select__control {
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .react-select-container .react-select__control:focus-within {
            border-color: #f43f5e;
            box-shadow: 0 0 0 1px #f43f5e;
          }
          .react-select-container .react-select__menu {
            background-color: white;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .react-select-container .react-select__option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
          }
          .react-select-container .react-select__option:hover {
            background-color: #f3f4f6;
          }
          .react-select-container .react-select__option--is-focused {
            background-color: #f3f4f6;
          }
          .react-select-container .react-select__option--is-selected {
            background-color: #ffe4e6;
            color: #881337;
          }
        `}
      </style>
    </div>
  );
} 