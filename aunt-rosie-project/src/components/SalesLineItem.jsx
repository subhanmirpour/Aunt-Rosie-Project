import React from 'react';
import ProductSelect from './ProductSelect';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function SalesLineItem({ 
  item, 
  onUpdate, 
  onRemove,
  excludeProductIds,
  index
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1">
        <ProductSelect
          value={item.productid || ''}
          onChange={(product) => {
            onUpdate(index, {
              ...item,
              productid: product.productid,
              unitprice: product.price
            });
          }}
          excludeIds={excludeProductIds}
        />
      </div>
      
      <div className="w-32">
        <input
          type="number"
          min="1"
          value={item.quantity || ''}
          onChange={(e) => {
            const quantity = parseInt(e.target.value) || 0;
            onUpdate(index, { ...item, quantity });
          }}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Quantity"
        />
      </div>

      <div className="w-32 text-right">
        ${((item.quantity || 0) * (item.unitprice || 0)).toFixed(2)}
      </div>

      <button
        onClick={() => onRemove(index)}
        className="p-2 text-gray-400 hover:text-red-500"
        title="Remove item"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
} 