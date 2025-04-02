import { supabase } from './supabaseClient';

export async function createCustomer(customerData) {
  console.log('=== Starting customer creation ===');
  console.log('Input customer data:', customerData);
  
  // Ensure required fields are present
  if (!customerData.firstname?.trim() || !customerData.lastname?.trim()) {
    throw new Error('First name and last name are required');
  }

  // Clean up the data
  const cleanedData = {
    firstname: customerData.firstname.trim(),
    lastname: customerData.lastname.trim(),
    email: customerData.email?.trim() || null,
    phone: customerData.phone?.trim() || null,
    preferredcontactmethod: customerData.preferredcontactmethod?.trim() || null
  };

  console.log('Cleaned customer data:', cleanedData);
  console.log('Supabase client configuration:', {
    url: supabase.supabaseUrl,
    hasAnonKey: !!supabase.supabaseKey
  });

  try {
    console.log('Attempting Supabase insert...');
    const { data, error } = await supabase
      .from('customers')
      .insert([cleanedData])
      .select()
      .single();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Error creating customer: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after customer creation');
    }

    console.log('Customer created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw error;
  }
}

export async function searchCustomers(query) {
  const { data, error } = await supabase
    .from('customers')
    .select('customerid, firstname, lastname')
    .or(`firstname.ilike.%${query}%,lastname.ilike.%${query}%`)
    .limit(5);

  if (error) {
    throw new Error(`Error searching customers: ${error.message}`);
  }

  return data;
} 