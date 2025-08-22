import React, { useEffect, useState } from 'react'
import Filters from '../components/Filters.jsx'
import { api } from '../core/api.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Purchases() {
  const [filters, setFilters] = useState({ from: '', to: '', baseId: '', equipmentType: '' })
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), baseId: '', equipmentTypeId: '', quantity: 0, reference: '' })
  const [bases, setBases] = useState([])
  const [eqTypes, setEqTypes] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/api/refs/bases').then(setBases).catch(()=>setBases([]))
    api.get('/api/refs/equipment-types').then(setEqTypes).catch(()=>setEqTypes([]))
  }, [])

  useEffect(() => { fetchList() }, [filters.from, filters.to, filters.baseId, filters.equipmentType])

  async function fetchList(){
    setLoading(true)
    try {
      const q = toQuery(filters)
      const res = await api.get(`/api/purchases${q}`)
      setItems(res)
    } catch(e){ console.error(e); setItems([]) } finally { setLoading(false) }
  }

  async function submit(e){
    e.preventDefault()
    try {
      const payload = { ...form, quantity: Number(form.quantity) }
      await api.post('/api/purchases', payload)
      setForm({ ...form, quantity: 0, reference: '' })
      fetchList()
    } catch(e){ alert(e.message) }
  }

  const role = user?.user?.role
  const myBaseId = user?.user?.baseId
  const canChooseAnyBase = role === 'Admin' || role === 'LogisticsOfficer'

  return (
    <div className="grid" style={{gap:16}}>
      <Filters value={filters} onChange={setFilters} />

      <div className="card">
        <h3>Record Purchase</h3>
        <form onSubmit={submit} className="row" style={{gap:10}}>
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
          <select className="select" value={form.baseId || (canChooseAnyBase?'':myBaseId)} onChange={e=>setForm({...form, baseId:e.target.value})} disabled={!canChooseAnyBase}>
            <option value="">{canChooseAnyBase?'Select Base':'My Base'}</option>
            {(canChooseAnyBase?bases:bases.filter(b=>b._id===myBaseId)).map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <select className="select" value={form.equipmentTypeId} onChange={e=>setForm({...form, equipmentTypeId:e.target.value})}>
            <option value="">Equipment Type</option>
            {eqTypes.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input className="input" type="number" min="0" step="1" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})}/>
          <input className="input" placeholder="Reference / Invoice" value={form.reference} onChange={e=>setForm({...form, reference:e.target.value})}/>
          <button className="button primary">Save</button>
        </form>
      </div>

      <div className="card">
        <div className="kpi">
          <h3>Purchase History</h3>
          <span className="badge">{items.length} records</span>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>Base</th><th>Equipment</th><th>Qty</th><th>Reference</th></tr></thead>
          <tbody>
          {items.map(x=>(
            <tr key={x._id}><td>{fmtDate(x.date)}</td><td>{x.baseName}</td><td>{x.equipmentName}</td><td>{x.quantity}</td><td>{x.reference || '-'}</td></tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function toQuery(f){
  const p = new URLSearchParams()
  if (f.from) p.set('from', f.from)
  if (f.to) p.set('to', f.to)
  if (f.baseId) p.set('baseId', f.baseId)
  if (f.equipmentType) p.set('equipmentType', f.equipmentType)
  return '?' + p.toString()
}
function fmtDate(s){ return s? new Date(s).toLocaleDateString() : '' }
