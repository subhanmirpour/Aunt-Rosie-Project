import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '../components/Modal';
import AddProductModal from '../components/AddProductModal';
import ProductTable from '../components/ProductTable';
import { validateProductData } from '../utils/formatters';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [editModal, setEditModal] = useState({ isOpen: false, productId: null, data: null });
  const [addModal, setAddModal] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Reset editing state when page changes
  useEffect(() => {
    setEditingId(null);
    setIsEditing(false);
    setEditModal({ isOpen: false, productId: null, data: null });
  }, [page]);

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
  }, [page]);

  // Add product handler
  async function handleAddProduct(productData) {
    setIsAddingProduct(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error.message);
        toast.error('Failed to add product');
        return;
      }

      toast.success('Product added successfully');
      
      // Update total count
      setTotalCount(prev => prev + 1);
      
      // If we're on the first page, update the products list
      if (page === 0) {
        setProducts(prev => {
          const newProducts = [data, ...prev];
          if (newProducts.length > itemsPerPage) {
            newProducts.pop(); // Remove last item if we've exceeded items per page
          }
          return newProducts;
        });
      }

      // Close modal and reset form
      setAddModal(false);
    } catch (err) {
      console.error('Unexpected error during add:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAddingProduct(false);
    }
  }

  // Delete handler
  async function handleDelete(product) {
    setDeleteModal({ isOpen: true, product });
  }

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

  // Edit handler
  const handleEdit = async (productId, editedData) => {
    if (!productId) {
      setEditingId(null);
      setIsEditing(false);
      return;
    }

    if (!editedData) {
      setEditingId(productId);
      setIsEditing(true);
      return;
    }

    // Validate the edited data
    const { isValid } = validateProductData(editedData);
    if (!isValid) {
      toast.error('Please fix the validation errors');
      return;
    }

    // Show confirmation modal
    setEditModal({ isOpen: true, productId, data: editedData });
  };

  // Handle edit confirmation
  const handleEditConfirm = async () => {
    const { productId, data: editedData } = editModal;
    setIsEditing(true);

    try {
      const { error } = await supabase
        .from('products')
        .update(editedData)
        .eq('productid', productId);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(prev =>
        prev.map(p =>
          p.productid === productId ? { ...p, ...editedData } : p
        )
      );

      toast.success('Product updated successfully');
      setEditingId(null);
      setEditModal({ isOpen: false, productId: null, data: null });
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsEditing(false);
    }
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
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          setEditModal({ isOpen: false, productId: null, data: null });
          setEditingId(null);
        }}
        onConfirm={handleEditConfirm}
        title="Confirm Edit"
        message="Are you sure you want to save these changes?"
        confirmText="Save Changes"
        confirmStyle="bg-green-600 hover:bg-green-700"
      />
      
      <AddProductModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onAdd={handleAddProduct}
        isLoading={isAddingProduct}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-rose-700">Product List</h2>
        <button
          onClick={() => setAddModal(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
        >
          Add Product
        </button>
      </div>
  
      {isLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <ProductTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isEditing={isEditing}
            editingId={editingId}
          />
          
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
