import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function LocationSales() {
  const [sales, setSales] = useState([]);
  const [locationTotals, setLocationTotals] = useState({});
  const [topLocation, setTopLocation] = useState(null);
  const [chartData, setChartData] = useState(null); // null by default

  useEffect(() => {
    const { data, error } = fetchSalesData();
    if (!error && data.length) {
      setSales(data);
      const grouped = groupSalesByLocation(data);
      setLocationTotals(grouped);
      setTopLocation(getTopLocation(grouped));
      setChartData(buildChartData(grouped));
    }
  }, []);

  const fetchSalesData = () => {
    return {
      data: JSON.parse(localStorage.getItem('sales')) || [],
      error: null,
    };
  };

  const groupSalesByLocation = (data) => {
    return data.reduce((acc, sale) => {
      const location = sale.locationid || 'Unknown';
      if (!acc[location]) acc[location] = 0;
      acc[location] += sale.saletotal;
      return acc;
    }, {});
  };

  const getTopLocation = (totals) => {
    const entries = Object.entries(totals);
    if (!entries.length) return null;
    return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
  };

  const buildChartData = (totals) => {
    return {
      labels: Object.keys(totals),
      datasets: [
        {
          label: 'Sales by Location',
          data: Object.values(totals),
          backgroundColor: '#60a5fa',
        },
      ],
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">📍 Location-Based Sales</h1>

      {topLocation && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          🏆 <strong>Top Performing Location:</strong> {topLocation[0]} (${topLocation[1].toFixed(2)})
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Sales by Location</h2>
        {chartData?.datasets?.length ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-center text-gray-500">
            No sales data to display yet. 📉 Try recording a sale!
          </p>
        )}
      </div>
    </div>
  );
}
