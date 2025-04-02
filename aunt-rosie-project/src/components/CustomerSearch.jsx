import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { supabase } from '../lib/supabase/supabaseClient';
import debounce from 'lodash/debounce';
import CustomerForm from './CustomerForm';
import { createCustomer } from '../lib/supabase/customers';

export default function CustomerSearch({ value, onChange, className = '' }) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch selected customer details when value changes
  useEffect(() => {
    if (value?.value) {
      const fetchCustomer = async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('customerid, firstname, lastname')
          .eq('customerid', value.value)
          .single();

        if (!error && data) {
          setSelectedCustomer({
            value: data.customerid,
            label: `${data.firstname} ${data.lastname}`
          });
        }
      };
      fetchCustomer();
    } else {
      setSelectedCustomer(null);
    }
  }, [value]);

  const searchCustomers = debounce(async (inputValue) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('customerid, firstname, lastname')
        .or(`firstname.ilike.%${inputValue}%,lastname.ilike.%${inputValue}%`)
        .limit(5);

      if (error) throw error;

      const formattedOptions = data.map(customer => ({
        value: customer.customerid,
        label: `${customer.firstname} ${customer.lastname}`
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error('Error searching customers:', error);
      setError('Error searching customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (inputValue) => {
    searchCustomers(inputValue);
  };

  const handleAddCustomer = async (customerData) => {
    console.log('=== Starting handleAddCustomer ===');
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('Attempting to create customer with data:', customerData);
      const newCustomer = await createCustomer(customerData);
      console.log('Customer created successfully:', newCustomer);
      
      if (!newCustomer || !newCustomer.customerid) {
        console.error('Invalid customer data received:', newCustomer);
        throw new Error('Invalid customer data received from server');
      }

      console.log('Creating new option for select:', {
        value: newCustomer.customerid,
        label: `${newCustomer.firstname} ${newCustomer.lastname}`
      });

      const newOption = {
        value: newCustomer.customerid,
        label: `${newCustomer.firstname} ${newCustomer.lastname}`
      };
      setOptions(prev => [...prev, newOption]);
      onChange(newOption);
      setShowAddCustomer(false);
    } catch (error) {
      console.error('Error in handleAddCustomer:', error);
      console.error('Error stack:', error.stack);
      setError(
        `Error adding customer: ${error.message}. Please check the console for details.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Select
        value={selectedCustomer}
        onChange={onChange}
        onInputChange={handleInputChange}
        options={options}
        isLoading={isLoading}
        placeholder="Start typing a name..."
        isClearable
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "No customers found"}
      />
      {!value && (
        <button
          type="button"
          onClick={() => setShowAddCustomer(true)}
          className="mt-2 text-sm text-rose-600 hover:text-rose-700"
        >
          Customer not listed? Add a new customer
        </button>
      )}

      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <CustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => {
                setShowAddCustomer(false);
                setError(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
} 