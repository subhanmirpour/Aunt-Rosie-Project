import { useState } from 'react';
import ThresholdBadge from './ThresholdBadge';

const IngredientTable = ({ 
  ingredients, 
  onDelete, 
  onEdit,
  isEditing,
  editingId
}) => {
  const [editData, setEditData] = useState(null);
  
  const handleDoubleClick = (ingredient) => {
    if (!isEditing) {
      setEditData({...ingredient});
      onEdit(ingredient.ingredientid);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdit(editingId, editData);
    } else if (e.key === 'Escape') {
      setEditData(null);
      onEdit(null);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderCell = (ingredient, field, value) => {
    if (editingId === ingredient.ingredientid) {
      if (!editData) {
        setEditData({...ingredient});
        return value;
      }

      const type = field === 'costperunit' || field === 'currentstock' || field === 'reorderthreshold' ? 'number' : 'text';
      const step = field === 'costperunit' ? '0.01' : '1';
      
      return (
        <input
          type={type}
          value={editData[field] ?? ''}
          onChange={(e) => handleChange(field, e.target.value)}
          onKeyDown={handleKeyDown}
          step={type === 'number' ? step : undefined}
          className="w-full px-2 py-1 border rounded"
          autoFocus={field === 'ingredientname'}
        />
      );
    }

    // Special rendering for different field types
    if (field === 'costperunit') {
      return formatCurrency(value);
    }

    return value ?? '';
  };

  const renderActions = (ingredient) => {
    if (editingId === ingredient.ingredientid) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ingredient.ingredientid, editData)}
            className="text-green-600 hover:text-green-900"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditData(null);
              onEdit(null);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => onDelete(ingredient)}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    );
  };

  return (
    <table className="w-full border text-sm mb-4">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-left p-2 font-bold">Name</th>
          <th className="text-left p-2 font-bold">Unit</th>
          <th className="text-left p-2 font-bold">Stock</th>
          <th className="text-left p-2 font-bold">Reorder At</th>
          <th className="text-left p-2 font-bold">Cost/Unit</th>
          <th className="text-left p-2 font-bold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient) => (
          <tr 
            key={ingredient.ingredientid} 
            className={`border-t hover:bg-gray-50 ${editingId === ingredient.ingredientid ? 'bg-blue-50' : ''}`}
            onDoubleClick={() => handleDoubleClick(ingredient)}
          >
            <td className="p-2">{renderCell(ingredient, 'ingredientname', ingredient.ingredientname)}</td>
            <td className="p-2">{renderCell(ingredient, 'unitofmeasure', ingredient.unitofmeasure)}</td>
            <td className="p-2">
              <div className="flex items-center gap-2">
                {renderCell(ingredient, 'currentstock', ingredient.currentstock)}
                <ThresholdBadge
                  currentStock={ingredient.currentstock}
                  reorderThreshold={ingredient.reorderthreshold}
                />
              </div>
            </td>
            <td className="p-2">{renderCell(ingredient, 'reorderthreshold', ingredient.reorderthreshold)}</td>
            <td className="p-2">{renderCell(ingredient, 'costperunit', ingredient.costperunit)}</td>
            <td className="p-2">
              {renderActions(ingredient)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IngredientTable; 