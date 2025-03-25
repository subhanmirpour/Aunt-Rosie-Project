const ThresholdBadge = ({ currentStock, reorderThreshold }) => {
  if (currentStock === null || reorderThreshold === null) return null;

  const stockLevel = currentStock / reorderThreshold;
  
  if (stockLevel <= 0.5) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Critical Stock
      </span>
    );
  }
  
  if (stockLevel <= 1) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        Low Stock
      </span>
    );
  }

  return null;
};

export default ThresholdBadge; 