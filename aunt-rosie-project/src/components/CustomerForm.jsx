import { useState } from 'react';

const initialFormData = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  preferredcontactmethod: ''
};

const tooltips = {
  firstname: 'Enter the customer\'s first name (2-50 characters)',
  lastname: 'Enter the customer\'s last name (2-50 characters)',
  email: 'Enter a valid email address (optional)',
  phone: 'Enter a valid phone number (optional)',
  preferredcontactmethod: 'Select how the customer prefers to be contacted'
};

const contactMethods = [
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Text', label: 'Text Message' },
  { value: 'Mail', label: 'Mail' }
];

const CustomerForm = ({ onSubmit, onCancel, isLoading, submitLabel = 'Add Customer' }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateField = (name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'firstname':
        if (!value?.trim()) {
          fieldErrors[name] = 'First name is required';
        } else if (value.length < 2) {
          fieldErrors[name] = 'First name must be at least 2 characters';
        } else if (value.length > 50) {
          fieldErrors[name] = 'First name must be less than 50 characters';
        }
        break;

      case 'lastname':
        if (!value?.trim()) {
          fieldErrors[name] = 'Last name is required';
        } else if (value.length < 2) {
          fieldErrors[name] = 'Last name must be at least 2 characters';
        } else if (value.length > 50) {
          fieldErrors[name] = 'Last name must be less than 50 characters';
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors[name] = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
          fieldErrors[name] = 'Please enter a valid phone number';
        }
        break;

      case 'preferredcontactmethod':
        if (value && !contactMethods.some(method => method.value === value)) {
          fieldErrors[name] = 'Please select a valid contact method';
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
    e.stopPropagation();
    
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

    onSubmit(formData);
  };

  const renderField = (name, label, type = 'text') => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {name === 'firstname' || name === 'lastname' ? '*' : ''}
        <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltips[name]}>
          ⓘ
        </span>
      </label>
      {name === 'preferredcontactmethod' ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            touchedFields[name] && errors[name] ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-1 focus:ring-rose-500`}
        >
          <option value="">Select contact method</option>
          {contactMethods.map(method => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      ) : (
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
      )}
      {touchedFields[name] && errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {renderField('firstname', 'First Name')}
      {renderField('lastname', 'Last Name')}
      {renderField('email', 'Email')}
      {renderField('phone', 'Phone')}
      {renderField('preferredcontactmethod', 'Preferred Contact Method')}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm; 