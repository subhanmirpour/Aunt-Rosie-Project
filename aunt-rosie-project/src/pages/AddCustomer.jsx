import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { createCustomer } from '../lib/supabase/customers';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (customerData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCustomer = await createCustomer(customerData);
      console.log('Customer created successfully:', newCustomer);
      navigate('/sales'); // Redirect back to sales page after successful creation
    } catch (error) {
      console.error('Error adding customer:', error);
      setError(error.message || 'Error adding customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Customer</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/sales')}
        isLoading={isLoading}
      />
    </div>
  );
} 