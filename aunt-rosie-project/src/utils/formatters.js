export const formatPrice = (price) => {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
};

export const validateProductData = (data) => {
  const errors = {};
  
  if (!data.productname?.trim()) {
    errors.productname = 'Product name is required';
  }
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  }
  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.price = 'Valid price is required';
  }
  if (!data.stockquantity || isNaN(data.stockquantity) || Number(data.stockquantity) < 0) {
    errors.stockquantity = 'Valid stock quantity is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 