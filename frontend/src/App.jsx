import React from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './modules/pages/Dashboard.jsx'
import Purchases from './modules/pages/Purchases.jsx'
import Transfers from './modules/pages/Transfers.jsx'
import Assignments from './modules/pages/Assignments.jsx'
import Login from './modules/pages/Login.jsx'
import { useAuth } from './modules/auth/AuthContext.jsx'
import { PrivateRoute, RoleGate } from './modules/auth/PrivateRoute.jsx'

export default function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <div className="navbar">
        <div className="brand"> Military Asset Management</div>

        {user && (
          <div className="nav-links">
            <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/">Dashboard</NavLink>

            <RoleGate roles={['Admin','LogisticsOfficer','BaseCommander']}>
              <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/purchases">Purchases</NavLink>
            </RoleGate>

            <RoleGate roles={['Admin','LogisticsOfficer','BaseCommander']}>
              <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/transfers">Transfers</NavLink>
            </RoleGate>

            {/* <RoleGate roles={['Admin','BaseCommander']}>
              <NavLink className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} to="/assignments">Assignments & Expenditures</NavLink>
            </RoleGate> */}
          </div>
        )}

        <div className="spacer" />
        {user ? (
          <div className="row">
            <span className="role-chip">{user.user?.role} {user.user?.baseName ? `• ${user.user.baseName}` : ''}</span>
            <button className="button" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </div>
        ) : null}
      </div>

      <main className="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/purchases" element={<PrivateRoute roles={['Admin','LogisticsOfficer','BaseCommander']}><Purchases /></PrivateRoute>} />
          <Route path="/transfers" element={<PrivateRoute roles={['Admin','LogisticsOfficer','BaseCommander']}><Transfers /></PrivateRoute>} />
          <Route path="/assignments" element={<PrivateRoute roles={['Admin','BaseCommander']}><Assignments /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}
