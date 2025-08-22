import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  if (roles && roles.length > 0) {
    const role = user.user?.role
    if (!roles.includes(role)) return <Navigate to="/" replace />
  }
  return children
}

export function RoleGate({ roles, children }) {
  const { user } = useAuth()
  const role = user?.user?.role
  if (!user) return null
  if (roles && !roles.includes(role)) return null
  return children
}
