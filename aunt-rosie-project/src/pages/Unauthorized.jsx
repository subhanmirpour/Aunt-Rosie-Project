import React from 'react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600">🚫 Access Denied</h1>
      <p className="text-gray-700 mt-4">You don’t have permission to view this page.</p>
    </div>
  );
}
