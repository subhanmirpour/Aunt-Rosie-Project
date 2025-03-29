import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ Navigate to Sales Tracker with a filter param
  const handleCardClick = (period) => {
    navigate(`/sales-tracker?period=${period}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Sales Card */}
        <div
          className="cursor-pointer bg-rose-100 p-4 rounded-lg shadow hover:bg-rose-200 transition"
          onClick={() => handleCardClick('daily')}
        >
          <h2 className="text-lg font-semibold">📅 Daily Sales</h2>
          <p className="text-xl font-bold text-rose-600">$1,250.00</p>
          <p className="text-sm text-gray-600 mt-2">View daily sales trends</p>
        </div>

        {/* Weekly Sales Card */}
        <div
          className="cursor-pointer bg-blue-100 p-4 rounded-lg shadow hover:bg-blue-200 transition"
          onClick={() => handleCardClick('weekly')}
        >
          <h2 className="text-lg font-semibold">📈 Weekly Sales</h2>
          <p className="text-xl font-bold text-blue-600">$8,750.00</p>
          <p className="text-sm text-gray-600 mt-2">Explore weekly performance</p>
        </div>

        {/* 30-Day Sales Card */}
        <div
          className="cursor-pointer bg-green-100 p-4 rounded-lg shadow hover:bg-green-200 transition"
          onClick={() => handleCardClick('monthly')}
        >
          <h2 className="text-lg font-semibold">📊 30-Day Sales</h2>
          <p className="text-xl font-bold text-green-600">$35,120.00</p>
          <p className="text-sm text-gray-600 mt-2">Check monthly trends</p>
        </div>

        {/* Quarterly Sales Card */}
        <div
          className="cursor-pointer bg-yellow-100 p-4 rounded-lg shadow hover:bg-yellow-200 transition"
          onClick={() => handleCardClick('quarterly')}
        >
          <h2 className="text-lg font-semibold">📆 Quarterly Sales</h2>
          <p className="text-xl font-bold text-yellow-600">$92,500.00</p>
          <p className="text-sm text-gray-600 mt-2">Analyze quarterly growth</p>
        </div>
      </div>
    </div>
  );
}
