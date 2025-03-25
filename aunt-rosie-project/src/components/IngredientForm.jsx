import { useState, useEffect } from 'react';

const initialFormData = {
  ingredientname: '',
  unitofmeasure: '',
  currentstock: '',
  reorderthreshold: '',
  costperunit: ''
};

const tooltips = {
  ingredientname: 'Enter the name of the ingredient (2-100 characters)',
  unitofmeasure: 'Unit of measurement (e.g., kg, g, L, ml)',
  currentstock: 'Current quantity in stock',
  reorderthreshold: 'Minimum quantity before reorder is needed',
  costperunit: 'Cost per unit in dollars'
};

const validateField = (name, value) => {
  const errors = {};

  switch (name) {
    case 'ingredientname':
      if (!value?.trim()) {
        errors[name] = 'Ingredient name is required';
      } else if (value.length < 2) {
        errors[name] = 'Name must be at least 2 characters';
      } else if (value.length > 100) {
        errors[name] = 'Name must be less than 100 characters';
      }
      break;

    case 'unitofmeasure':
      if (!value?.trim()) {
        errors[name] = 'Unit of measure is required';
      } else if (value.length > 10) {
        errors[name] = 'Unit must be less than 10 characters';
      }
      break;

    case 'currentstock':
      if (value === '') {
        errors[name] = 'Current stock is required';
      } else if (isNaN(value) || Number(value) < 0) {
        errors[name] = 'Stock must be a non-negative number';
      } else if (Number(value) > 999999) {
        errors[name] = 'Stock must be less than 1,000,000';
      }
      break;

    case 'reorderthreshold':
      if (value === '') {
        errors[name] = 'Reorder threshold is required';
      } else if (isNaN(value) || Number(value) < 0) {
        errors[name] = 'Threshold must be a non-negative number';
      } else if (Number(value) > 999999) {
        errors[name] = 'Threshold must be less than 1,000,000';
      }
      break;

    case 'costperunit':
      if (value === '') {
        errors[name] = 'Cost per unit is required';
      } else if (isNaN(value) || Number(value) <= 0) {
        errors[name] = 'Cost must be greater than 0';
      } else if (Number(value) > 999999.99) {
        errors[name] = 'Cost must be less than 1,000,000';
      } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        errors[name] = 'Cost can only have up to 2 decimal places';
      }
      break;
  }

  return errors;
};

const IngredientForm = ({ initialData, onSubmit, onCancel, isLoading, submitLabel = 'Submit' }) => {
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
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  };

  const validateForm = () => {
    const allErrors = {};
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(allErrors, fieldErrors);
    });
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
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

    const ingredientData = {
      ...formData,
      currentstock: Number(formData.currentstock),
      reorderthreshold: Number(formData.reorderthreshold),
      costperunit: Number(formData.costperunit)
    };

    onSubmit(ingredientData);
  };

  const renderField = (name, label, type = 'text') => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
        <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltips[name]}>
          ⓘ
        </span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded-md ${
          touchedFields[name] && errors[name] ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-1 focus:ring-rose-500`}
      />
      {touchedFields[name] && errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderField('ingredientname', 'Ingredient Name')}
      {renderField('unitofmeasure', 'Unit of Measure')}
      {renderField('currentstock', 'Current Stock', 'number')}
      {renderField('reorderthreshold', 'Reorder Threshold', 'number')}
      {renderField('costperunit', 'Cost per Unit', 'number')}

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

export default IngredientForm; 