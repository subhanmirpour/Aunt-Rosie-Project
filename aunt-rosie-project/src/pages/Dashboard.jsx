import React from 'react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-rose-700 mb-4">Welcome, {user?.username || 'Guest'}!</h1>
      <p className="text-gray-600 mb-6">Here’s an overview of your pie empire 🍓🥧</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-rose-600 mb-2">Today's Sales</h2>
          <p className="text-gray-700">$342.50</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-rose-600 mb-2">Inventory Low</h2>
          <ul className="text-gray-700 list-disc list-inside">
            <li>Butter</li>
            <li>Hot Horseradish</li>
          </ul>
        </div>
    
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-rose-600 mb-2">Total Products</h2>
          <p className="text-gray-700">15 active products</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-rose-600 mb-2">Customer Feedback</h2>
          <p className="text-gray-700 italic">“Best steak pies in town!”</p>
        </div>
      </div>
    </div>
  );
}
