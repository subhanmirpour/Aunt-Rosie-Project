import ProductForm from './ProductForm';

const AddProductModal = ({ isOpen, onClose, onAdd, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h3>
        <ProductForm
          onSubmit={onAdd}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel="Add Product"
        />
      </div>
    </div>
  );
};

export default AddProductModal; 