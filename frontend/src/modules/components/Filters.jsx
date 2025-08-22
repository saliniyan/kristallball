import React, { useEffect, useState } from 'react'
import { api } from '../core/api.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Filters({ value, onChange, showToBase=false }) {
  const { user } = useAuth()
  const [bases, setBases] = useState([])
  const [eqTypes, setEqTypes] = useState([])

  useEffect(() => {
    api.get('/api/refs/bases').then(setBases).catch(() => setBases([]))
    api.get('/api/refs/equipment-types').then(setEqTypes).catch(() => setEqTypes([]))
  }, [])

  const role = user?.user?.role
  const myBaseId = user?.user?.baseId

  const canChooseAnyBase = role === 'Admin' || role === 'LogisticsOfficer'
  const baseOptions = canChooseAnyBase ? bases : bases.filter(b => b._id === myBaseId)

  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="row">
          <input className="input" type="date" value={value.from}
            onChange={e => onChange({ ...value, from: e.target.value })} />
          <input className="input" type="date" value={value.to}
            onChange={e => onChange({ ...value, to: e.target.value })} />
          <select className="select" value={value.equipmentType || ''} onChange={e=>onChange({ ...value, equipmentType: e.target.value || undefined })}>
            <option value="">All Equipment</option>
            {eqTypes.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>

          <select className="select" value={value.baseId || ''} onChange={e=>onChange({ ...value, baseId: e.target.value || undefined })} disabled={!canChooseAnyBase}>
            <option value="">{canChooseAnyBase ? 'All Bases' : 'My Base'}</option>
            {baseOptions.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>

          {showToBase && (
            <select className="select" value={value.toBaseId || ''} onChange={e=>onChange({ ...value, toBaseId: e.target.value || undefined })}>
              <option value="">Any Destination</option>
              {bases.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          )}
        </div>
        <div className="footer-note">Filters apply to tables and KPIs below.</div>
      </div>
    </div>
  )
}
