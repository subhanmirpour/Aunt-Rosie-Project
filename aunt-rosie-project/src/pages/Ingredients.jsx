import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import IngredientTable from '../components/IngredientTable';
import AddIngredientModal from '../components/AddIngredientModal';
import EditIngredientModal from '../components/EditIngredientModal';
import Modal from '../components/Modal';
import {
  fetchIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient
} from '../lib/supabase/ingredients';

const ITEMS_PER_PAGE = 10;

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadIngredients = async () => {
    try {
      setIsLoading(true);
      const { data, count } = await fetchIngredients(page, ITEMS_PER_PAGE);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAdd = async (data) => {
    try {
      setIsProcessing(true);
      await addIngredient(data);
      toast.success('Ingredient added successfully');
      setAddModal(false);
      if (page === 1) {
        loadIngredients();
      } else {
        setPage(1);
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Failed to add ingredient');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient);
    setEditModal(true);
  };

  const handleUpdate = async (data) => {
    try {
      setIsProcessing(true);
      await updateIngredient(selectedIngredient.id, data);
      toast.success('Ingredient updated successfully');
      setEditModal(false);
      loadIngredients();
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteIngredient(selectedIngredient.id);
      toast.success('Ingredient deleted successfully');
      setDeleteModal(false);
      if (ingredients.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadIngredients();
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast.error('Failed to delete ingredient');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ingredients</h1>
        <button
          onClick={() => setAddModal(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Add Ingredient
        </button>
      </div>

      <IngredientTable
        ingredients={ingredients}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {!isLoading && ingredients.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(page * ITEMS_PER_PAGE, totalCount)} of {totalCount} ingredients
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded ${
                page >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddIngredientModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleAdd}
        isLoading={isProcessing}
      />

      <EditIngredientModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onSubmit={handleUpdate}
        isLoading={isProcessing}
        ingredient={selectedIngredient}
      />

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Ingredient"
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete {selectedIngredient?.ingredientname}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Ingredients; 