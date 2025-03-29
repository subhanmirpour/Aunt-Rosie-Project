import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import 'chart.js/auto';

// ✅ Helper to get query parameter from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function SalesTracker() {
  const query = useQuery();
  const period = query.get('period') || 'daily'; // Default to daily if no period is passed

  const [sales, setSales] = useState([]);
  const [totals, setTotals] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    quarterly: 0,
  });

  const defaultChartData = {
    labels: [],
    datasets: [
      {
        label: 'Sales Data',
        data: [],
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.2)',
      },
    ],
  };

  const [dailyChartData, setDailyChartData] = useState(defaultChartData);
  const [weeklyChartData, setWeeklyChartData] = useState(defaultChartData);
  const [monthlyChartData, setMonthlyChartData] = useState(defaultChartData);
  const [quarterlyChartData, setQuarterlyChartData] = useState(defaultChartData);

  // ✅ Load sales data from localStorage
  const loadSalesData = async () => {
    const { data, error } = await fetchSalesData();
    if (!error) {
      setSales(data);
      calculateTotals(data);
      prepareChartData(data);
    } else {
      console.error('Error loading sales:', error);
    }
  };

  useEffect(() => {
    loadSalesData();

    // ✅ Listen for salesUpdated event to auto-refresh data
    const handleSalesUpdate = () => loadSalesData();
    window.addEventListener('salesUpdated', handleSalesUpdate);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('salesUpdated', handleSalesUpdate);
  }, []);

  // ✅ Calculate totals for daily, weekly, monthly, quarterly
  const calculateTotals = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lastQuarter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const dailySales = data.filter((sale) => sale.saledate === today);
    const weeklySales = data.filter((sale) => new Date(sale.saledate) >= last7Days);
    const monthlySales = data.filter((sale) => new Date(sale.saledate) >= last30Days);
    const quarterlySales = data.filter((sale) => new Date(sale.saledate) >= lastQuarter);

    setTotals({
      daily: dailySales.reduce((sum, sale) => sum + sale.saletotal, 0),
      weekly: weeklySales.reduce((sum, sale) => sum + sale.saletotal, 0),
      monthly: monthlySales.reduce((sum, sale) => sum + sale.saletotal, 0),
      quarterly: quarterlySales.reduce((sum, sale) => sum + sale.saletotal, 0),
    });
  };

  // ✅ Prepare line chart data for trends
  const prepareChartData = (data) => {
    const prepareLineData = (days) => {
      const dateRange = Array.from({ length: days }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
      }).reverse();

      const salesData = dateRange.map((date) => {
        const total = data
          .filter((sale) => sale.saledate === date)
          .reduce((sum, sale) => sum + sale.saletotal, 0);
        return total;
      });

      return {
        labels: dateRange,
        datasets: [
          {
            label: `${days === 7 ? 'Weekly' : days === 30 ? '30-Day' : 'Quarterly'} Sales Trends`,
            data: salesData,
            borderColor: '#fb923c',
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
          },
        ],
      };
    };

    setDailyChartData(prepareLineData(7) || defaultChartData);
    setWeeklyChartData(prepareLineData(7) || defaultChartData);
    setMonthlyChartData(prepareLineData(30) || defaultChartData);
    setQuarterlyChartData(prepareLineData(90) || defaultChartData);
  };

  // ✅ Select chart title and data based on period query param
  let chartTitle = '';
  let chartData = {};

  switch (period) {
    case 'daily':
      chartTitle = '📈 Daily Sales Trends (Last 7 Days)';
      chartData = dailyChartData;
      break;
    case 'weekly':
      chartTitle = '📊 Weekly Sales Trends';
      chartData = weeklyChartData;
      break;
    case 'monthly':
      chartTitle = '📆 30-Day Sales Trends';
      chartData = monthlyChartData;
      break;
    case 'quarterly':
      chartTitle = '📊 Quarterly Sales Trends';
      chartData = quarterlyChartData;
      break;
    default:
      chartTitle = '📈 Sales Trends Overview';
      chartData = dailyChartData;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-4">📊 Sales Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-rose-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">📅 Daily Sales</h2>
          <p className="text-xl font-bold text-rose-600">${totals.daily.toFixed(2)}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">📈 Weekly Sales</h2>
          <p className="text-xl font-bold text-blue-600">${totals.weekly.toFixed(2)}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">📊 30-Day Sales</h2>
          <p className="text-xl font-bold text-green-600">${totals.monthly.toFixed(2)}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">📆 Quarterly Sales</h2>
          <p className="text-xl font-bold text-yellow-600">${totals.quarterly.toFixed(2)}</p>
        </div>
      </div>

      {/* Dynamic Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}

// ✅ Mock function to fetch sales data
async function fetchSalesData() {
  return {
    data: JSON.parse(localStorage.getItem('sales')) || [],
    error: null,
  };
}
