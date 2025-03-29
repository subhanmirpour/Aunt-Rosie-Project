import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;

  // Admins can access everything. Otherwise, if a specific role is required, ensure it matches.
  if (role && user.role !== role && user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
