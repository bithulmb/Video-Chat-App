import useAuth from '@/components/hooks/useAuth'
import React from 'react'
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {

    const {isAuthenticated} = useAuth()

  return !isAuthenticated ? <Outlet/> : <Navigate to="/dashboard" replace />;
  
}

export default PublicRoute
