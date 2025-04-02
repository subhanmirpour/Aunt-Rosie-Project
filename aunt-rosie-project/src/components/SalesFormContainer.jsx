import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createSale } from '../lib/supabase/sales';
import LocationSelect from './LocationSelect';
import SalesLineItem from './SalesLineItem';
import AlertModal from './AlertModal';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function SalesFormContainer() {
  const [formData, setFormData] = useState({
    saledate: new Date().toISOString().split('T')[0],
    locationid: '',
    items: [{ productid: '', quantity: '', unitprice: 0 }]
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // ✅ Trigger salesUpdated event after successful sale
  const { mutate: submitSale, isLoading } = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      // Reset form
      setFormData({
        saledate: new Date().toISOString().split('T')[0],
        locationid: '',
        items: [{ productid: '', quantity: '', unitprice: 0 }]
      });

      setAlert({
        isOpen: true,
        title: 'Success',
        message: 'Sale recorded successfully!'
      });

      // 🛎️ Emit salesUpdated event to notify SalesTracker
      window.dispatchEvent(new Event('salesUpdated'));
    },
    onError: (error) => {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Error recording sale: ' + error.message
      });
    }
  });

  const validateForm = () => {
    if (!formData.locationid) {
      setAlert({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please select a location'
      });
      return false;
    }

    if (!formData.items.length) {
      setAlert({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please add at least one product'
      });
      return false;
    }

    const invalidItems = formData.items.filter(
      item => !item.productid || !item.quantity
    );

    if (invalidItems.length) {
      setAlert({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please complete all product entries'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Calculate total
    const saletotal = formData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitprice),
      0
    );

    // Submit sale with full timestamp
    submitSale({
      sale: {
        saledate: new Date(`${formData.saledate}T${new Date().toTimeString().slice(0, 8)}`),
        locationid: formData.locationid,
        saletotal
      },
      items: formData.items
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productid: '', quantity: '', unitprice: 0 }]
    }));
  };

  const updateItem = (index, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) {
      setAlert({
        isOpen: true,
        title: 'Validation Error',
        message: 'At least one product line is required'
      });
      return;
    }

    const itemToDelete = formData.items[index];
    if (!itemToDelete.productid || !itemToDelete.quantity) {
      // Allow delete silently for incomplete rows
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
      return;
    }

    // Remove the item and update formData
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Move total calculation to a useMemo hook to optimize performance
  const total = React.useMemo(() =>
    formData.items.reduce(
      (sum, item) => sum + ((item.quantity || 0) * (item.unitprice || 0)),
      0
    ),
    [formData.items]
  );

  const usedProductIds = formData.items
    .filter(item => item.productid)
    .map(item => item.productid);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sale Date
            </label>
            <input
              type="date"
              value={formData.saledate}
              onChange={(e) => setFormData(prev => ({ ...prev, saledate: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <LocationSelect
              value={formData.locationid}
              onChange={(locationid) => setFormData(prev => ({ ...prev, locationid }))}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Products</h3>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Product
            </button>
          </div>

          {formData.items.map((item, index) => (
            <SalesLineItem
              key={index}
              item={item}
              index={index}
              onUpdate={updateItem}
              onRemove={removeItem}
              excludeProductIds={usedProductIds.filter(id => id !== item.productid)}
            />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xl font-semibold">
            Total: ${total.toFixed(2)}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Recording Sale...' : 'Record Sale'}
          </button>
        </div>
      </form>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
      />
    </>
  );
}
