import { supabase } from './supabaseClient';

export const fetchIngredients = async ({ page = 0, itemsPerPage = 5 } = {}) => {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Get paginated data
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1)
      .order('ingredientid', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      data,
      count,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchIngredients:', error.message);
    return {
      data: null,
      count: 0,
      error
    };
  }
};

export const addIngredient = async (ingredientData) => {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .insert([ingredientData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error in addIngredient:', error.message);
    return {
      data: null,
      error
    };
  }
};

export const updateIngredient = async (id, ingredientData) => {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .update(ingredientData)
      .eq('ingredientid', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error in updateIngredient:', error.message);
    return {
      data: null,
      error
    };
  }
};

export const deleteIngredient = async (id) => {
  try {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('ingredientid', id);

    if (error) {
      throw error;
    }

    return {
      error: null
    };
  } catch (error) {
    console.error('Error in deleteIngredient:', error.message);
    return {
      error
    };
  }
}; 