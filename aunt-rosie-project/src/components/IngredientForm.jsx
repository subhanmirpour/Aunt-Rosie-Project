import { useState, useEffect } from 'react';

const initialFormData = {
  ingredientname: '',
  unitofmeasure: '',
  currentstock: '',
  reorderthreshold: '',
  costperunit: '',
  notes: ''
};

const tooltips = {
  ingredientname: 'Enter the name of the ingredient (2-100 characters)',
  unitofmeasure: 'Unit of measurement (e.g., kg, g, L, ml)',
  currentstock: 'Current quantity in stock (whole numbers only)',
  reorderthreshold: 'Minimum quantity before reorder is needed (whole numbers only)',
  costperunit: 'Cost per unit in dollars (up to 2 decimal places)',
  notes: 'Additional notes about the ingredient (optional)'
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

  const validateField = (name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'ingredientname':
        if (!value?.trim()) {
          fieldErrors[name] = 'Ingredient name is required';
        } else if (value.length < 2) {
          fieldErrors[name] = 'Name must be at least 2 characters';
        } else if (value.length > 100) {
          fieldErrors[name] = 'Name must be less than 100 characters';
        }
        break;

      case 'unitofmeasure':
        if (!value?.trim()) {
          fieldErrors[name] = 'Unit of measure is required';
        } else if (value.length > 10) {
          fieldErrors[name] = 'Unit must be less than 10 characters';
        }
        break;

      case 'currentstock':
        if (value === '') {
          fieldErrors[name] = 'Current stock is required';
        } else if (isNaN(value) || Number(value) < 0) {
          fieldErrors[name] = 'Stock must be a non-negative number';
        } else if (Number(value) > 999999) {
          fieldErrors[name] = 'Stock must be less than 1,000,000';
        } else if (!Number.isInteger(Number(value))) {
          fieldErrors[name] = 'Stock must be a whole number';
        }
        break;

      case 'reorderthreshold':
        if (value === '') {
          fieldErrors[name] = 'Reorder threshold is required';
        } else if (isNaN(value) || Number(value) < 0) {
          fieldErrors[name] = 'Threshold must be a non-negative number';
        } else if (Number(value) > 999999) {
          fieldErrors[name] = 'Threshold must be less than 1,000,000';
        } else if (!Number.isInteger(Number(value))) {
          fieldErrors[name] = 'Threshold must be a whole number';
        }
        break;

      case 'costperunit':
        if (value === '') {
          fieldErrors[name] = 'Cost per unit is required';
        } else if (isNaN(value) || Number(value) <= 0) {
          fieldErrors[name] = 'Cost must be greater than 0';
        } else if (Number(value) > 999999.99) {
          fieldErrors[name] = 'Cost must be less than 1,000,000';
        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
          fieldErrors[name] = 'Cost can only have up to 2 decimal places';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));

    return Object.keys(fieldErrors).length === 0;
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouchedFields(allTouched);
    
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      return;
    }

    const processedData = {
      ...formData,
      currentstock: Number(formData.currentstock),
      reorderthreshold: Number(formData.reorderthreshold),
      costperunit: Number(formData.costperunit)
    };

    onSubmit(processedData);
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

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
          <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltips.notes}>
            ⓘ
          </span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
        />
      </div>

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