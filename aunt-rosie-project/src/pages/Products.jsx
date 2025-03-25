import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '../components/Modal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch products on page load
  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        setIsLoading(true);
        
        // Fetch total count
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Error fetching count:', countError.message);
          toast.error('Failed to load total count');
          return;
        }

        setTotalCount(count || 0);

        // Fetch paginated data
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1)
          .order('productid', { ascending: true });
        
        if (error) {
          console.error('Error fetching products:', error.message);
          toast.error('Failed to load products');
          return;
        }

        if (mounted) {
          setProducts(data || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [page]); // Added page to dependencies

  // Delete handler
  async function deleteProduct(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('productid', id);
      if (error) {
        console.error('Delete error:', error.message);
        toast.error('Failed to delete product');
        return;
      }
      setProducts(products.filter(p => p.productid !== id));
      toast.success('Product deleted successfully');
      setDeleteModal({ isOpen: false, product: null });
      
      // Update total count
      setTotalCount(prev => prev - 1);
      
      // If we're on the last page and it's now empty, go to previous page
      if (products.length === 1 && page > 0) {
        setPage(prev => prev - 1);
      }
    } catch (err) {
      console.error('Unexpected error during delete:', err);
      toast.error('An unexpected error occurred');
    }
  }

  // Format price helper function
  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={() => deleteProduct(deleteModal.product?.productid)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.product?.productname}"? This action cannot be undone.`}
      />
      
      <h2 className="text-3xl font-bold text-rose-700 mb-6">Product List</h2>
  
      {isLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
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
                <tr key={product.productid} className="border-t hover:bg-gray-50">
                  <td className="p-2">{product.productname}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">{product.size || 'N/A'}</td>
                  <td className="p-2">{formatPrice(product.price)}</td>
                  <td className="p-2">{product.stockquantity || 0}</td>
                  <td className="p-2">{product.description || 'No description'}</td>
                  <td className="p-2">
                    {product.allergeninfo && (
                      <div className="text-red-600 text-xs mb-1">
                        Allergens: {product.allergeninfo}
                      </div>
                    )}
                    {product.dietaryinfo && (
                      <div className="text-green-600 text-xs">
                        {product.dietaryinfo}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => setDeleteModal({ isOpen: true, product })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-3 py-1 rounded ${
                  page === 0
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                Previous
              </button>
              
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className={`px-3 py-1 rounded ${
                  page >= totalPages - 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {page * itemsPerPage + 1} to {Math.min((page + 1) * itemsPerPage, totalCount)} of {totalCount} items
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
