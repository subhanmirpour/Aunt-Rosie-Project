import Modal from './Modal';
import IngredientForm from './IngredientForm';

const AddIngredientModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const handleSubmit = (data) => {
    if (data === null) {
      onClose();
    } else {
      onSubmit(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Ingredient"
    >
      <IngredientForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        submitLabel="Add Ingredient"
      />
    </Modal>
  );
};

export default AddIngredientModal; 