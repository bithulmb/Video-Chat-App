import useAuth from '@/components/hooks/useAuth'
import React from 'react'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {

    const {isAuthenticated} = useAuth()

  return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />;
  
}

export default ProtectedRoute
