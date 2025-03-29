import React, { useEffect, useState } from 'react';

export default function SalesTracker() {
  const [sales, setSales] = useState([]);
  const [totals, setTotals] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    quarterly: 0,
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sales')) || [];
    setSales(data);
    calculateTotals(data);
  }, []);

  const calculateTotals = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lastQuarter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const dailySales = data.filter((sale) => sale.date === today);
    const weeklySales = data.filter((sale) => new Date(sale.date) >= last7Days);
    const monthlySales = data.filter((sale) => new Date(sale.date) >= last30Days);
    const quarterlySales = data.filter((sale) => new Date(sale.date) >= lastQuarter);

    setTotals({
      daily: dailySales.reduce((sum, sale) => sum + sale.amount * sale.quantity, 0),
      weekly: weeklySales.reduce((sum, sale) => sum + sale.amount * sale.quantity, 0),
      monthly: monthlySales.reduce((sum, sale) => sum + sale.amount * sale.quantity, 0),
      quarterly: quarterlySales.reduce((sum, sale) => sum + sale.amount * sale.quantity, 0),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-4">📊 Sales Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
