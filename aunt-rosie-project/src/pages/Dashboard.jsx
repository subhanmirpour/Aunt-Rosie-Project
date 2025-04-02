import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSalesSummary } from '../lib/supabase/sales';

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['salesSummary'],
    queryFn: getSalesSummary
  });

  const handleCardClick = (period) => {
    navigate(`/sales-tracker?period=${period}`);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-rose-700 mb-4">
        Welcome, {user?.username || 'Guest'}!
      </h1>
      <p className="text-gray-600 mb-6">Here's an overview of your pie empire 🍓🥧</p>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold text-rose-600 mb-2">Today's Sales</h2>
        <p className="text-gray-700">
          {isLoading ? 'Loading...' : error ? 'Error loading data' : `$${summary?.dailyTotal.toFixed(2)}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          title="📅 Daily Sales"
          value={summary?.dailyTotal || 0}
          description="View daily sales trends"
          color="rose"
          onClick={() => handleCardClick('daily')}
        />
        <Card
          title="📈 Weekly Sales"
          value={summary?.weeklyTotal || 0}
          description="Explore weekly performance"
          color="blue"
          onClick={() => handleCardClick('weekly')}
        />
        <Card
          title="📊 30-Day Sales"
          value={summary?.thirtyDayTotal || 0}
          description="Check monthly trends"
          color="green"
          onClick={() => handleCardClick('monthly')}
        />
        <Card
          title="📆 Quarterly Sales"
          value={summary?.quarterlyTotal || 0}
          description="Analyze quarterly growth"
          color="yellow"
          onClick={() => handleCardClick('quarterly')}
        />
        <Card
          title="📍 Location-Based Sales"
          value={''}
          description="See which markets perform best"
          color="indigo"
          onClick={() => navigate('/sales-tracker')}
        />
      </div>
    </div>
  );
}

function Card({ title, value, description, onClick, color }) {
  const bgColors = {
    rose: 'bg-rose-100 hover:bg-rose-200 text-rose-600',
    blue: 'bg-blue-100 hover:bg-blue-200 text-blue-600',
    green: 'bg-green-100 hover:bg-green-200 text-green-600',
    yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600',
    indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600',
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-lg shadow transition ${
        bgColors[color] || 'bg-gray-100 text-gray-600'
      }`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {value !== '' && <p className="text-xl font-bold">{`$${value.toFixed(2)}`}</p>}
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
