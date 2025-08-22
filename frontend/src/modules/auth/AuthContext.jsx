import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../core/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (user) sessionStorage.setItem('auth', JSON.stringify(user))
    else sessionStorage.removeItem('auth')
  }, [user])

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password }, { withAuth: false })
    setUser(res)
    return res
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout, setUser }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
