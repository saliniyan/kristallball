import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username.trim(), form.password)
      nav(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card card">
      <h2>Sign in</h2>
      <form onSubmit={onSubmit} className="grid" style={{gap:12}}>
        <input className="input" placeholder="Username" value={form.username}
               onChange={e=>setForm({ ...form, username: e.target.value })}/>
        <input className="input" placeholder="Password" type="password" value={form.password}
               onChange={e=>setForm({ ...form, password: e.target.value })}/>
        {error && <div className="badge danger">{error}</div>}
        <button className="button primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <div className="footer-note" style={{marginTop:10}}>
        Roles: Admin, BaseCommander, LogisticsOfficer .
      </div>
    </div>
  )
}
