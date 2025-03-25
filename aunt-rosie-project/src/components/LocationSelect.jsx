import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLocations } from '../lib/supabase/sales';

export default function LocationSelect({ value, onChange, className = '' }) {
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations
  });

  if (isLoading) return <select className={className} disabled><option>Loading...</option></select>;
  if (error) return <select className={className} disabled><option>Error loading locations</option></select>;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${className}`}
    >
      <option value="">Select Location</option>
      {locations.map((location) => (
        <option key={location.locationid} value={location.locationid}>
          {location.locationname}
        </option>
      ))}
    </select>
  );
} 