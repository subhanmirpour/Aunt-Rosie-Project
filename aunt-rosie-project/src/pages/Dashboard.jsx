import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const [totals, setTotals] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    quarterly: 0,
  });
  const [topProduct, setTopProduct] = useState(null);

  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    const last7 = new Date(now - 7 * 86400000);
    const last30 = new Date(now - 30 * 86400000);
    const last90 = new Date(now - 90 * 86400000);

    const dailySales = sales.filter((s) => s.saledate === today);
    const weeklySales = sales.filter((s) => new Date(s.saledate) >= last7);
    const monthlySales = sales.filter((s) => new Date(s.saledate) >= last30);
    const quarterlySales = sales.filter((s) => new Date(s.saledate) >= last90);

    setTotals({
      daily: dailySales.reduce((sum, s) => sum + s.saletotal, 0),
      weekly: weeklySales.reduce((sum, s) => sum + s.saletotal, 0),
      monthly: monthlySales.reduce((sum, s) => sum + s.saletotal, 0),
      quarterly: quarterlySales.reduce((sum, s) => sum + s.saletotal, 0),
    });

    // 🔥 Top Product Calculation
    const productCounts = {};
    sales.forEach((sale) => {
      sale.items?.forEach((item) => {
        const name = item.productid || 'Unknown';
        productCounts[name] = (productCounts[name] || 0) + Number(item.quantity || 0);
      });
    });

    const top = Object.entries(productCounts).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max,
      ['None', 0]
    );
    setTopProduct(top);
  }, []);

  const handleCardClick = (period) => {
    navigate(`/sales-tracker?period=${period}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">👋 Welcome back, Aunt Rosie!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          title="📅 Daily Sales"
          value={totals.daily}
          description="View daily sales trends"
          color="rose"
          onClick={() => handleCardClick('daily')}
        />
        <Card
          title="📈 Weekly Sales"
          value={totals.weekly}
          description="Explore weekly performance"
          color="blue"
          onClick={() => handleCardClick('weekly')}
        />
        <Card
          title="📊 30-Day Sales"
          value={totals.monthly}
          description="Check monthly trends"
          color="green"
          onClick={() => handleCardClick('monthly')}
        />
        <Card
          title="📆 Quarterly Sales"
          value={totals.quarterly}
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

      {topProduct && (
        <div className="mt-8 text-center text-green-700 font-medium">
          🥧 Best Seller: <strong>{topProduct[0]}</strong> with <strong>{topProduct[1]}</strong> units sold
        </div>
      )}
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
      className={`cursor-pointer p-4 rounded-lg shadow transition ${bgColors[color] || 'bg-gray-100 text-gray-600'}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {value !== '' && <p className="text-xl font-bold">${value.toFixed(2)}</p>}
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
