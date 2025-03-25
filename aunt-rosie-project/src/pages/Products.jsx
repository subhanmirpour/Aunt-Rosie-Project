import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch from Supabase
  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setProducts(data);
    }
  }

  // Delete handler
  async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('ProductID', id);
    if (error) {
      console.error('Delete error:', error.message);
    } else {
      fetchProducts(); // Refresh after delete
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-rose-700 mb-6">Product List</h2>
      <table className="w-full border text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Size</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.ProductID} className="border-t">
              <td className="p-2">{p.ProductName}</td>
              <td className="p-2">{p.Category}</td>
              <td className="p-2">{p.Size}</td>
              <td className="p-2">${p.Price.toFixed(2)}</td>
              <td className="p-2">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteProduct(p.ProductID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
