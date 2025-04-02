import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { supabase } from '../lib/supabase/supabaseClient';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';

export default function CustomerSearch({ value, onChange, className = '' }) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (inputValue) => {
    searchCustomers(inputValue);
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
        <Link
          to="/add-customer"
          className="mt-2 text-sm text-rose-600 hover:text-rose-700 block"
        >
          Customer not listed? Add a new customer
        </Link>
      )}
    </div>
  );
} 