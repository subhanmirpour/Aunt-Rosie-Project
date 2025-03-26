import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import IngredientTable from '../components/IngredientTable';
import AddIngredientModal from '../components/AddIngredientModal';
import Modal from '../components/Modal';
import {
  fetchIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient
} from '../lib/supabase/ingredients';

const ITEMS_PER_PAGE = 5;

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, ingredient: null });
  const [editModal, setEditModal] = useState({ isOpen: false, ingredientId: null, data: null });
  const [addModal, setAddModal] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Reset editing state when page changes
  useEffect(() => {
    setEditingId(null);
    setIsEditing(false);
    setEditModal({ isOpen: false, ingredientId: null, data: null });
  }, [page]);

  const loadIngredients = async () => {
    try {
      setIsLoading(true);
      const { data, count } = await fetchIngredients({ page, itemsPerPage: ITEMS_PER_PAGE });
      setIngredients(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      toast.error('Failed to load ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, [page]);

  const handleAdd = async (data) => {
    setIsAddingIngredient(true);
    try {
      await addIngredient(data);
      toast.success('Ingredient added successfully');
      setAddModal(false);
      if (page === 0) {
        loadIngredients();
      } else {
        setPage(0);
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Failed to add ingredient');
    } finally {
      setIsAddingIngredient(false);
    }
  };

  const handleEdit = async (ingredientId, editedData) => {
    if (!ingredientId) {
      setEditingId(null);
      setIsEditing(false);
      return;
    }

    if (!editedData) {
      setEditingId(ingredientId);
      setIsEditing(true);
      return;
    }

    // Show confirmation modal
    setEditModal({ isOpen: true, ingredientId, data: editedData });
  };

  const handleEditConfirm = async () => {
    const { ingredientId, data: editedData } = editModal;
    setIsEditing(true);

    try {
      // Convert string values to numbers where needed
      const processedData = {
        ...editedData,
        costperunit: parseFloat(editedData.costperunit),
        currentstock: parseInt(editedData.currentstock),
        reorderthreshold: parseInt(editedData.reorderthreshold)
      };

      await updateIngredient(ingredientId, processedData);
      
      // Update local state
      setIngredients(prev =>
        prev.map(i =>
          i.ingredientid === ingredientId ? { ...i, ...processedData } : i
        )
      );

      toast.success('Ingredient updated successfully');
      setEditingId(null);
      setEditModal({ isOpen: false, ingredientId: null, data: null });
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = (ingredient) => {
    setDeleteModal({ isOpen: true, ingredient });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteIngredient(deleteModal.ingredient.ingredientid);
      toast.success('Ingredient deleted successfully');
      setDeleteModal({ isOpen: false, ingredient: null });
      
      if (ingredients.length === 1 && page > 0) {
        setPage(prev => prev - 1);
      } else {
        loadIngredients();
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast.error('Failed to delete ingredient');
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
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, ingredient: null })}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.ingredient?.ingredientname}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          setEditModal({ isOpen: false, ingredientId: null, data: null });
          setEditingId(null);
        }}
        onConfirm={handleEditConfirm}
        title="Confirm Edit"
        message="Are you sure you want to save these changes?"
        confirmText="Save Changes"
        confirmStyle="bg-green-600 hover:bg-green-700"
      />
      
      <AddIngredientModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleAdd}
        isLoading={isAddingIngredient}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-rose-700">Ingredient List</h2>
        <button
          onClick={() => setAddModal(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
        >
          Add Ingredient
        </button>
      </div>
  
      {isLoading ? (
        <p className="text-gray-500">Loading ingredients...</p>
      ) : ingredients.length === 0 ? (
        <p className="text-gray-500">No ingredients found.</p>
      ) : (
        <>
          <IngredientTable
            ingredients={ingredients}
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
              Showing {page * ITEMS_PER_PAGE + 1} to {Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} of {totalCount} items
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Ingredients; 