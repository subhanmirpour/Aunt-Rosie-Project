import { supabase } from './supabaseClient';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('productid, productname, price, stockquantity, size')
    .order('productname');
  
  if (error) throw error;
  return data;
}

export async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('locationname');
  
  if (error) throw error;
  return data;
}

export async function createSale({ sale, items }) {
  try {
    // Start a Supabase transaction
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        saledate: sale.saledate,
        locationid: sale.locationid,
        paymentmethod: sale.paymentmethod,
        customerid: sale.customerid || null,
        saletotal: sale.saletotal
      }])
      .select()
      .single();

    if (saleError) throw saleError;

    // Prepare sale items with the new sale ID
    const saleItems = items.map(item => ({
      saleid: saleData.saleid,
      productid: item.productid,
      quantitysold: item.quantity,
      unitprice: item.unitprice
    }));

    // Insert all sale items
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    // Update product inventory
    for (const item of items) {
      const { error: updateError } = await supabase.rpc('update_product_inventory', {
        p_productid: item.productid,
        p_quantity: item.quantity // Pass positive quantity since RPC function handles subtraction
      });

      if (updateError) throw updateError;
    }

    // Trigger a refresh of the products list
    window.dispatchEvent(new Event('productsUpdated'));

    return saleData;
  } catch (error) {
    console.error('Error in createSale:', error);
    throw error;
  }
} 