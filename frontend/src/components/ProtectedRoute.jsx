import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized, maybe redirect to their specific dashboard based on role
    return user.role === 'Admin' 
      ? <Navigate to="/admin" replace /> 
      : <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
