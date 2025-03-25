import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/supabase/sales';

export default function ProductSelect({ value, onChange, className = '', excludeIds = [] }) {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 2
  });

  if (isLoading) return <select className={className} disabled><option>Loading...</option></select>;
  if (error) return <select className={className} disabled><option>Error loading products</option></select>;

  const availableProducts = products.filter(product => !excludeIds.includes(product.productid));

  const formatProductOption = (product) => {
    const size = product.unitsize ? ` (${product.unitsize}${product.unitmeasure || ''})` : '';
    const stock = product.quantityinstock ? ` - ${product.quantityinstock} in stock` : '';
    const price = product.unitprice ? ` - $${Number(product.unitprice).toFixed(2)}` : ' - Price N/A';
    return `${product.productname}${size}${price}${stock}`;
  };

  return (
    <select
      value={value}
      onChange={(e) => {
        const product = products.find(p => p.productid === parseInt(e.target.value));
        onChange(product || null);
      }}
      className={`block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${className}`}
    >
      <option value="">Select Product</option>
      {availableProducts.map((product) => (
        <option key={product.productid} value={product.productid}>
          {formatProductOption(product)}
        </option>
      ))}
    </select>
  );
} 