import { useState } from 'react';
import { formatPrice } from '../utils/formatters';

const ProductTable = ({ 
  products, 
  onDelete, 
  onEdit,
  isEditing,
  editingId
}) => {
  const [editData, setEditData] = useState(null);
  
  const handleDoubleClick = (product) => {
    if (!isEditing) {
      setEditData({...product});
      onEdit(product.productid);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditData(null);
      onEdit(null);
    }
  };

  const renderCell = (product, field, value) => {
    if (editingId === product.productid) {
      if (!editData) {
        setEditData({...product});
        return value;
      }

      const type = field === 'price' || field === 'stockquantity' ? 'number' : 'text';
      const step = field === 'price' ? '0.01' : '1';
      
      return (
        <input
          type={type}
          value={editData[field] ?? ''}
          onChange={(e) => handleChange(field, e.target.value)}
          onKeyDown={handleKeyDown}
          step={type === 'number' ? step : undefined}
          className="w-full px-2 py-1 border rounded"
          autoFocus={field === 'productname'}
        />
      );
    }

    // Special rendering for different field types
    if (field === 'price') {
      return formatPrice(value);
    }
    if (field === 'description' && !value) {
      return 'No description';
    }
    if (field === 'size' && !value) {
      return 'N/A';
    }
    if (field === 'stockquantity' && value === null) {
      return '0';
    }

    return value;
  };

  return (
    <table className="w-full border text-sm mb-4">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Category</th>
          <th className="text-left p-2">Size</th>
          <th className="text-left p-2">Price</th>
          <th className="text-left p-2">Stock</th>
          <th className="text-left p-2">Description</th>
          <th className="text-left p-2">Dietary Info</th>
          <th className="text-left p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr 
            key={product.productid} 
            className={`border-t hover:bg-gray-50 ${editingId === product.productid ? 'bg-blue-50' : ''}`}
            onDoubleClick={() => handleDoubleClick(product)}
          >
            <td className="p-2">{renderCell(product, 'productname', product.productname)}</td>
            <td className="p-2">{renderCell(product, 'category', product.category)}</td>
            <td className="p-2">{renderCell(product, 'size', product.size)}</td>
            <td className="p-2">{renderCell(product, 'price', product.price)}</td>
            <td className="p-2">{renderCell(product, 'stockquantity', product.stockquantity)}</td>
            <td className="p-2">{renderCell(product, 'description', product.description)}</td>
            <td className="p-2">
              {product.allergeninfo && (
                <div className="text-red-600 text-xs mb-1">
                  Allergens: {renderCell(product, 'allergeninfo', product.allergeninfo)}
                </div>
              )}
              {product.dietaryinfo && (
                <div className="text-green-600 text-xs">
                  {renderCell(product, 'dietaryinfo', product.dietaryinfo)}
                </div>
              )}
            </td>
            <td className="p-2">
              {editingId === product.productid ? (
                <div className="flex gap-2">
                  <button
                    className="text-green-600 hover:underline text-sm"
                    onClick={() => onEdit(product.productid, editData)}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-600 hover:underline text-sm"
                    onClick={() => {
                      setEditData(null);
                      onEdit(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onDelete(product)}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable; 