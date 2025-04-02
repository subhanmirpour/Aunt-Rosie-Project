import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSalesSummary } from '../lib/supabase/sales';
import 'chart.js/auto';

const useUrlQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function SalesTracker() {
  const query = useUrlQuery();
  const period = query.get('period') || 'daily';
  const [locationChartData, setLocationChartData] = useState(null);
  const [chartData, setChartData] = useState(null);

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['salesSummary'],
    queryFn: getSalesSummary,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (!summary) return;

    // Prepare trend chart data
    if (period === 'daily' || period === 'weekly') {
      const last7Days = summary.dailySales.slice(-7);
      setChartData({
        labels: last7Days.map(day => day.displayDate),
        datasets: [{
          label: 'Daily Sales',
          data: last7Days.map(day => day.total),
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.2)',
          tension: 0.4,
          fill: true
        }]
      });
    } else {
      setChartData({
        labels: summary.dailySales.map(day => day.displayDate),
        datasets: [{
          label: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Trends`,
          data: summary.dailySales.map(day => day.total),
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.2)',
          tension: 0.4,
          fill: true
        }]
      });
    }

    // Prepare location chart data
    const locationTotals = summary.sales?.reduce((acc, sale) => {
      const locationName = summary.locationMap[sale.locationid] || 'Unknown';
      if (!acc[locationName]) acc[locationName] = 0;
      acc[locationName] += sale.saletotal;
      return acc;
    }, {}) || {};

    setLocationChartData({
      labels: Object.keys(locationTotals),
      datasets: [{
        label: 'Sales by Location',
        data: Object.values(locationTotals),
        backgroundColor: '#60a5fa'
      }]
    });
  }, [summary, period]);

  const chartTitle = {
    daily: '📈 Daily Sales Trends (Last 7 Days)',
    weekly: '📊 Weekly Sales Trends',
    monthly: '📆 30-Day Sales Trends',
    quarterly: '📊 Quarterly Sales Trends'
  }[period];

  if (isLoading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">Error loading sales data</div>;
  if (!chartData) return <div className="text-center p-6">Preparing chart data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">📊 Sales Tracker</h1>

      {/* Totals + Top Location Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card title="📅 Daily Sales" value={summary?.dailyTotal || 0} color="rose" />
        <Card title="📈 Weekly Sales" value={summary?.weeklyTotal || 0} color="blue" />
        <Card title="📊 30-Day Sales" value={summary?.thirtyDayTotal || 0} color="green" />
        <Card title="📆 Quarterly Sales" value={summary?.quarterlyTotal || 0} color="yellow" />
        
        <div className="bg-purple-100 text-purple-600 p-4 rounded-lg col-span-1">
          <h2 className="text-md font-semibold mb-2">📍 Top Location</h2>
          {summary?.topLocation ? (
            <div className="mb-2 font-medium">
              {summary.topLocation[0]} — <strong>${summary.topLocation[1].toFixed(2)}</strong>
            </div>
          ) : (
            <p>No data yet</p>
          )}
          {locationChartData?.datasets?.length ? (
            <Bar
              data={locationChartData}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { display: false },
                  y: { display: false }
                },
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Line Graph */}
      <div className="bg-white p-4 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
        <Line 
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `$${value}`
                }
              }
            }
          }}
        />
      </div>

      {/* Location-Based Graph */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📍 Sales by Location</h2>
        {summary?.topLocation && (
          <div className="mb-4 text-green-700 font-medium">
            🏆 Top Location: <strong>{summary.topLocation[0]}</strong> (${summary.topLocation[1].toFixed(2)})
          </div>
        )}
        {locationChartData?.datasets?.length ? (
          <Bar 
            data={locationChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                }
              }
            }}
          />
        ) : (
          <p className="text-center text-gray-500">📉 No sales data available</p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const bg = {
    rose: 'bg-rose-100 text-rose-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }[color] || 'bg-gray-100 text-gray-600';

  return (
    <div className={`p-4 rounded-lg ${bg}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xl font-bold">${value.toFixed(2)}</p>
    </div>
  );
}
