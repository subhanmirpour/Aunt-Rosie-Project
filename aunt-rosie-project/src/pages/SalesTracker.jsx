import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import 'chart.js/auto';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function SalesTracker() {
  const query = useQuery();
  const period = query.get('period') || 'daily';

  const [sales, setSales] = useState([]);
  const [totals, setTotals] = useState({ daily: 0, weekly: 0, monthly: 0, quarterly: 0 });
  const [topLocation, setTopLocation] = useState(null);
  const [locationChartData, setLocationChartData] = useState(null);

  const defaultChartData = {
    labels: [],
    datasets: [{
      label: 'Sales Data',
      data: [],
      borderColor: '#fb923c',
      backgroundColor: 'rgba(251, 146, 60, 0.2)'
    }]
  };

  const [chartData, setChartData] = useState(defaultChartData);

  useEffect(() => {
    const loadSalesData = async () => {
      const { data } = await fetchSalesData();
      setSales(data);
      calculateTotals(data);
      prepareTrendChart(data);
      prepareLocationChart(data);
    };

    loadSalesData();

    const handleSalesUpdate = () => loadSalesData();
    window.addEventListener('salesUpdated', handleSalesUpdate);
    return () => window.removeEventListener('salesUpdated', handleSalesUpdate);
  }, [period]);

  const fetchSalesData = async () => {
    return {
      data: JSON.parse(localStorage.getItem('sales')) || [],
      error: null
    };
  };

  const calculateTotals = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    const last7Days = new Date(now - 7 * 86400000);
    const last30Days = new Date(now - 30 * 86400000);
    const last90Days = new Date(now - 90 * 86400000);

    const dailySales = data.filter(sale => sale.saledate === today);
    const weeklySales = data.filter(sale => new Date(sale.saledate) >= last7Days);
    const monthlySales = data.filter(sale => new Date(sale.saledate) >= last30Days);
    const quarterlySales = data.filter(sale => new Date(sale.saledate) >= last90Days);

    setTotals({
      daily: dailySales.reduce((sum, s) => sum + s.saletotal, 0),
      weekly: weeklySales.reduce((sum, s) => sum + s.saletotal, 0),
      monthly: monthlySales.reduce((sum, s) => sum + s.saletotal, 0),
      quarterly: quarterlySales.reduce((sum, s) => sum + s.saletotal, 0)
    });
  };

  const prepareTrendChart = (data) => {
    const days = period === 'daily' || period === 'weekly' ? 7 : period === 'monthly' ? 30 : 90;
    const labels = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      return d.toISOString().split('T')[0];
    });

    const values = labels.map(date =>
      data.filter(s => s.saledate === date).reduce((sum, s) => sum + s.saletotal, 0)
    );

    setChartData({
      labels,
      datasets: [{
        label: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Trends`,
        data: values,
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.2)'
      }]
    });
  };

  const prepareLocationChart = (data) => {
    const totalsByLocation = data.reduce((acc, sale) => {
      const location = sale.locationid || 'Unknown';
      if (!acc[location]) acc[location] = 0;
      acc[location] += sale.saletotal;
      return acc;
    }, {});

    const top = Object.entries(totalsByLocation).reduce((max, curr) => curr[1] > max[1] ? curr : max, ["None", 0]);

    setTopLocation(top);

    setLocationChartData({
      labels: Object.keys(totalsByLocation),
      datasets: [{
        label: 'Sales by Location',
        data: Object.values(totalsByLocation),
        backgroundColor: '#60a5fa'
      }]
    });
  };

  const chartTitle = {
    daily: '📈 Daily Sales Trends (Last 7 Days)',
    weekly: '📊 Weekly Sales Trends',
    monthly: '📆 30-Day Sales Trends',
    quarterly: '📊 Quarterly Sales Trends'
  }[period];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">📊 Sales Tracker</h1>

      {/* Totals + Top Location Chart */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
  <Card title="📅 Daily Sales" value={totals.daily} color="rose" />
  <Card title="📈 Weekly Sales" value={totals.weekly} color="blue" />
  <Card title="📊 30-Day Sales" value={totals.monthly} color="green" />
  <Card title="📆 Quarterly Sales" value={totals.quarterly} color="yellow" />
  
  <div className="bg-purple-100 text-purple-600 p-4 rounded-lg col-span-1">
    <h2 className="text-md font-semibold mb-2">📍 Top Location</h2>
    {topLocation ? (
      <div className="mb-2 font-medium">
        {topLocation[0]} — <strong>${topLocation[1].toFixed(2)}</strong>
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
        <Line data={chartData} />
      </div>

      {/* Location-Based Graph */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📍 Sales by Location</h2>
        {topLocation && (
          <div className="mb-4 text-green-700 font-medium">
            🏆 Top Location: <strong>{topLocation[0]}</strong> (${topLocation[1].toFixed(2)})
          </div>
        )}
        {locationChartData?.datasets?.length ? (
          <Bar data={locationChartData} />
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
