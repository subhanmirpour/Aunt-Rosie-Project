import Modal from './Modal';
import IngredientForm from './IngredientForm';

const EditIngredientModal = ({ isOpen, onClose, onSubmit, isLoading, ingredient }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Ingredient"
      size="lg"
    >
      <div className="p-6">
        <IngredientForm
          initialData={ingredient}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel="Save Changes"
        />
      </div>
    </Modal>
  );
};

export default EditIngredientModal; 