const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete',
  confirmStyle = 'bg-red-600 hover:bg-red-700',
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        
        {children ? (
          children
        ) : (
          <>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded ${confirmStyle}`}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal; 