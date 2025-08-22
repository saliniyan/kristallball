import React, { useEffect, useState } from 'react'
import Filters from '../components/Filters.jsx'
import { api } from '../core/api.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Transfers() {
  const [filters, setFilters] = useState({ from: '', to: '', baseId: '', toBaseId:'', equipmentType: '' })
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), fromBaseId: '', toBaseId: '', equipmentTypeId: '', quantity: 0, reference: '' })
  const [bases, setBases] = useState([])
  const [eqTypes, setEqTypes] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/api/refs/bases').then(setBases).catch(()=>setBases([]))
    api.get('/api/refs/equipment-types').then(setEqTypes).catch(()=>setEqTypes([]))
  }, [])

  useEffect(() => { fetchList() }, [filters.from, filters.to, filters.baseId, filters.toBaseId, filters.equipmentType])

  async function fetchList(){
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (filters.from) p.set('from', filters.from)
      if (filters.to) p.set('to', filters.to)
      if (filters.baseId) p.set('fromBaseId', filters.baseId)
      if (filters.toBaseId) p.set('toBaseId', filters.toBaseId)
      if (filters.equipmentType) p.set('equipmentType', filters.equipmentType)
      const res = await api.get(`/api/transfers?${p.toString()}`)
      setItems(res)
    } catch(e){ console.error(e); setItems([]) } finally { setLoading(false) }
  }

  async function submit(e){
    e.preventDefault()
    try {
      const payload = { ...form, quantity: Number(form.quantity) }
      if (!payload.fromBaseId || !payload.toBaseId || payload.fromBaseId === payload.toBaseId) {
        alert('Select different From/To bases.'); return
      }
      await api.post('/api/transfers', payload)
      setForm({ ...form, quantity: 0, reference: '' })
      fetchList()
    } catch(e){ alert(e.message) }
  }

  const role = user?.user?.role
  const myBaseId = user?.user?.baseId
  const canChooseAnyBase = role === 'Admin' || role === 'LogisticsOfficer'

  return (
    <div className="grid" style={{gap:16}}>
      <Filters value={filters} onChange={setFilters} showToBase />

      <div className="card">
        <h3>Record Transfer</h3>
        <form onSubmit={submit} className="row" style={{gap:10}}>
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
          <select className="select" value={form.fromBaseId || (canChooseAnyBase?'':myBaseId)} onChange={e=>setForm({...form, fromBaseId:e.target.value})} disabled={!canChooseAnyBase}>
            <option value="">{canChooseAnyBase?'From Base':'My Base'}</option>
            {(canChooseAnyBase?bases:bases.filter(b=>b._id===myBaseId)).map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <select className="select" value={form.toBaseId} onChange={e=>setForm({...form, toBaseId:e.target.value})}>
            <option value="">To Base</option>
            {bases.map(b=><option key={b._1d} value={b._id}>{b.name}</option>)}
          </select>
          <select className="select" value={form.equipmentTypeId} onChange={e=>setForm({...form, equipmentTypeId:e.target.value})}>
            <option value="">Equipment Type</option>
            {eqTypes.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input className="input" type="number" min="0" step="1" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})}/>
          <input className="input" placeholder="Reference / Note" value={form.reference} onChange={e=>setForm({...form, reference:e.target.value})}/>
          <button className="button primary">Save</button>
        </form>
      </div>

      <div className="card">
        <div className="kpi">
          <h3>Transfer History</h3>
          <span className="badge">{items.length} records</span>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>From</th><th>To</th><th>Equipment</th><th>Qty</th><th>Reference</th></tr></thead>
        <tbody>
          {items.map(x=>(
            <tr key={x._id}>
              <td>{fmtDate(x.date)}</td>
              <td>{x.fromBaseName}</td>
              <td>{x.toBaseName}</td>
              <td>{x.equipmentName}</td>
              <td>{x.quantity}</td>
              <td>{x.reference || '-'}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}

function fmtDate(s){ return s? new Date(s).toLocaleDateString() : '' }
