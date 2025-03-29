import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import toast from 'react-hot-toast';

const LabelGenerator = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [labelData, setLabelData] = useState(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('productid', { ascending: true });
    if (error) {
      toast.error('Error fetching products');
    } else {
      setProducts(data);
      if (data && data.length > 0) {
        setSelectedProductId(data[0].productid);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleGenerateLabel = async () => {
    if (!selectedProductId) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('productid', selectedProductId)
      .single();
    if (error) {
      toast.error('Error generating label');
    } else {
      setLabelData(data);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-rose-700 mb-6">Product Label Generator</h2>
      
      <div className="mb-4">
        {isLoading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <select
            className="border rounded p-2"
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            {products.map(product => (
              <option key={product.productid} value={product.productid}>
                {product.productname}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={handleGenerateLabel}
        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded"
      >
        Generate Label
      </button>

      {labelData && (
        <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-gray-300 max-w-sm mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-2xl font-bold text-rose-600">{labelData.productname}</h3>
            <span className="text-sm text-gray-500">ID: {labelData.productid}</span>
          </div>
          {/* Product Details */}
          <p className="text-lg mb-2">{labelData.description}</p>
          <p className="mb-2">
            <strong>Category:</strong> {labelData.category} &bull; <strong>Size:</strong> {labelData.size}
          </p>
          <p className="mb-2">
            <strong>Price:</strong> ${labelData.price}
          </p>
          <p className="mb-2">
            <strong>Allergens:</strong> {labelData.allergeninfo || 'None'}
          </p>
          {labelData.dietaryinfo && (
            <p className="mb-2">
              <strong>Dietary Info:</strong> {labelData.dietaryinfo}
            </p>
          )}
          {/* Disclaimer & Contains Section */}
          <div className="mt-4 p-4 border-t border-gray-300">
            <p className="text-xs text-gray-600 italic">
              Disclaimer: This product is manufactured in compliance with all applicable food and health safety regulations. Please consult your healthcare provider if you have any concerns regarding allergens or dietary restrictions.
            </p>
            <p className="mt-2 text-sm">
              This product contains: Water, Salt, Sugar, Natural Flavors, Spices, Preservatives, Antioxidants, Emulsifiers, Stabilizers, and a blend of common food additives.
            </p>
          </div>
          {/* Footer */}
          <div className="mt-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Aunt Rosie's Kitchen
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelGenerator;
