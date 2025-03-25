import Modal from './Modal';
import IngredientForm from './IngredientForm';

const AddIngredientModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Ingredient"
      size="lg"
    >
      <div className="p-6">
        <IngredientForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel="Add Ingredient"
        />
      </div>
    </Modal>
  );
};

export default AddIngredientModal; 