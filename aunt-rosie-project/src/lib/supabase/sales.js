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
  // Start a Supabase transaction
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert([{
      saledate: sale.saledate,
      locationid: sale.locationid,
      saletotal: sale.saletotal,
      customerid: sale.customerid || null
    }])
    .select()
    .single();

  if (saleError) throw saleError;

  // Prepare sale items with the new sale ID
  const saleItems = items.map(item => ({
    saleid: saleData.saleid,
    productid: item.productid,
    quantitysold: item.quantity,
    unitprice: item.price
  }));

  // Insert all sale items
  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsError) throw itemsError;

  return saleData;
} 