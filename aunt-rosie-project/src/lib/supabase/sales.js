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

export async function getSalesSummary() {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    const last90Days = new Date(today);
    last90Days.setDate(last90Days.getDate() - 90);

    // Fetch locations first to get location names
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('locationid, locationname');
    
    if (locationsError) throw locationsError;

    const locationMap = locations.reduce((acc, loc) => {
      acc[loc.locationid] = loc.locationname;
      return acc;
    }, {});

    // Fetch daily totals for the last 30 days
    const { data: dailyTotals, error: dailyError } = await supabase
      .from('sales')
      .select('saledate, saletotal')
      .gte('saledate', last30Days.toISOString().split('T')[0])
      .lte('saledate', today.toISOString().split('T')[0]);

    if (dailyError) {
      console.error('Error fetching daily totals:', dailyError);
      throw dailyError;
    }

    // Format the daily sales data with proper aggregation
    const dailySales = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Sum all sales for this specific date
      const dayTotal = dailyTotals
        .filter(sale => sale.saledate === dateStr)
        .reduce((sum, sale) => sum + Number(sale.saletotal), 0);
      
      return {
        date: dateStr,
        displayDate: new Date(dateStr).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        total: dayTotal
      };
    });

    // Fetch all sales data for other calculations
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .gte('saledate', last90Days.toISOString().split('T')[0]);

    if (salesError) throw salesError;

    // Calculate totals for different periods
    let dailyTotal = 0;
    let weeklyTotal = 0;
    let thirtyDayTotal = 0;
    let quarterlyTotal = 0;

    // Calculate location-based totals
    const locationTotals = {};

    sales.forEach((sale) => {
      const saleDate = new Date(sale.saledate);
      const saleTotal = sale.saletotal || 0;

      // Update location totals using location name
      const locationName = locationMap[sale.locationid] || 'Unknown';
      locationTotals[locationName] = (locationTotals[locationName] || 0) + saleTotal;

      // Update period totals
      if (saleDate >= yesterday) dailyTotal += saleTotal;
      if (saleDate >= last7Days) weeklyTotal += saleTotal;
      if (saleDate >= last30Days) thirtyDayTotal += saleTotal;
      if (saleDate >= last90Days) quarterlyTotal += saleTotal;
    });

    // Find top location
    const topLocation = Object.entries(locationTotals).reduce((max, curr) => 
      curr[1] > max[1] ? curr : max
    , ['None', 0]);

    return {
      dailyTotal,
      weeklyTotal,
      thirtyDayTotal,
      quarterlyTotal,
      topLocation,
      dailySales,
      sales,
      locationMap
    };
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw error;
  }
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