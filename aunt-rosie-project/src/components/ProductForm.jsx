import { useState, useEffect } from 'react';

const initialFormData = {
  productname: '',
  category: '',
  size: '',
  price: '',
  description: '',
  stockquantity: '',
  allergeninfo: '',
  dietaryinfo: ''
};

const tooltips = {
  productname: 'Enter the full name of the product (2-100 characters)',
  category: 'Product category (e.g., Pies, Preserves, Cookies)',
  size: 'Product size or weight (e.g., 250g, 500ml)',
  price: 'Product price in dollars (up to 2 decimal places)',
  stockquantity: 'Available quantity in stock (whole numbers only)',
  description: 'Brief description of the product',
  allergeninfo: 'List any allergens (e.g., Contains: wheat, eggs, dairy)',
  dietaryinfo: 'Dietary information (e.g., Vegetarian, Vegan, Gluten-Free)'
};

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading, submitLabel = 'Submit' }) => {
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    const newError = {};
    
    switch (name) {
      case 'productname':
        if (!value.trim()) {
          newError[name] = 'Product name is required';
        } else if (value.length < 2) {
          newError[name] = 'Product name must be at least 2 characters';
        } else if (value.length > 100) {
          newError[name] = 'Product name must be less than 100 characters';
        }
        break;
      
      case 'category':
        if (!value.trim()) {
          newError[name] = 'Category is required';
        } else if (value.length > 50) {
          newError[name] = 'Category must be less than 50 characters';
        }
        break;
      
      case 'price':
        if (!value) {
          newError[name] = 'Price is required';
        } else if (isNaN(value) || Number(value) <= 0) {
          newError[name] = 'Price must be greater than 0';
        } else if (Number(value) > 999999.99) {
          newError[name] = 'Price must be less than 1,000,000';
        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
          newError[name] = 'Price can only have up to 2 decimal places';
        }
        break;
      
      case 'stockquantity':
        if (!value) {
          newError[name] = 'Stock quantity is required';
        } else if (isNaN(value) || !Number.isInteger(Number(value))) {
          newError[name] = 'Stock quantity must be a whole number';
        } else if (Number(value) < 0) {
          newError[name] = 'Stock quantity cannot be negative';
        } else if (Number(value) > 999999) {
          newError[name] = 'Stock quantity must be less than 1,000,000';
        }
        break;
      
      case 'size':
        if (value && value.length > 20) {
          newError[name] = 'Size must be less than 20 characters';
        }
        break;
      
      case 'description':
        if (value && value.length > 255) {
          newError[name] = 'Description must be less than 255 characters';
        }
        break;

      case 'allergeninfo':
        if (value && value.length > 255) {
          newError[name] = 'Allergen info must be less than 255 characters';
        }
        break;

      case 'dietaryinfo':
        if (value && value.length > 255) {
          newError[name] = 'Dietary info must be less than 255 characters';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      ...newError
    }));
    return !newError[name];
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouchedFields(allTouched);
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stockquantity: Number(formData.stockquantity)
    };

    onSubmit(productData);
  };

  const renderField = (name, label, type = 'text', isTextArea = false) => {
    const Component = isTextArea ? 'textarea' : 'input';
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {(name === 'productname' || name === 'category' || name === 'price' || name === 'stockquantity') && ' *'}
          <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltips[name]}>
            ⓘ
          </span>
        </label>
        <Component
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={isTextArea ? "3" : undefined}
          className={`w-full px-3 py-2 border rounded-md ${
            touchedFields[name] && errors[name] ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-1 focus:ring-rose-500`}
        />
        {touchedFields[name] && errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderField('productname', 'Product Name')}
      {renderField('category', 'Category')}
      {renderField('size', 'Size')}
      {renderField('price', 'Price', 'number')}
      {renderField('stockquantity', 'Stock Quantity', 'number')}
      {renderField('description', 'Description', 'text', true)}
      {renderField('allergeninfo', 'Allergen Information')}
      {renderField('dietaryinfo', 'Dietary Information')}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded flex items-center ${
            isLoading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 