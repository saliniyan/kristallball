import React, { useEffect, useState } from 'react'
import Filters from '../components/Filters.jsx'
import NetMovementModal from '../components/NetMovementModal.jsx'
import { api } from '../core/api.js'
import './dashboard.css'

const todayISO = () => new Date().toISOString().slice(0,10)
const firstOfMonthISO = () => { const d=new Date(); d.setDate(1); return d.toISOString().slice(0,10)}

export default function Dashboard() {
  const [filters, setFilters] = useState({ from:firstOfMonthISO(), to:todayISO(), baseId:'', equipmentType:'' })
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openNM, setOpenNM] = useState(false)
  const [nmData, setNmData] = useState(null)
  const [nmLoading, setNmLoading] = useState(false)

  async function loadSummary(){
    setLoading(true)
    try{
      const q = toQuery(filters)
      const res = await api.get(`/api/dashboard/summary${q}`)
      setSummary(res)
    } catch(e){ console.error(e); setSummary(null) }
    finally { setLoading(false) }
  }

  useEffect(()=>{ loadSummary() }, [filters.from, filters.to, filters.baseId, filters.equipmentType])

  async function openNetMovement(){
    setOpenNM(true); setNmLoading(true)
    try {
      const q = toQuery(filters)
      const res = await api.get(`/api/dashboard/net-movement-details${q}`)
      setNmData(res)
    } catch(e){ console.error(e); setNmData(null) }
    finally { setNmLoading(false) }
  }

  const k = summary || {}
  const netMovement = (k.purchases||0) + (k.transferIn||0) - (k.transferOut||0)

  return (
    <div className="dashboard">
      <Filters value={filters} onChange={setFilters} />

      {/* Metrics row */}
      <div className="metrics-grid">
        <div className="card metric">
          <div className="metric-label">Opening Balance</div>
          <div className="metric-value">{num(k.openingBalance)}</div>
        </div>
        <div className="card metric">
          <div className="metric-label">Closing Balance</div>
          <div className="metric-value">{num(k.closingBalance)}</div>
        </div>
        <div className="card metric clickable" onClick={openNetMovement} title="Click to see breakdown">
          <div className="metric-header">
            <div>
              <div className="metric-label">Net Movement</div>
              <div className="metric-value">{num(netMovement)}</div>
            </div>
            <span className={`badge ${netMovement>0?'ok':(netMovement<0?'danger':'')}`}>details</span>
          </div>
          <div className="footer-note">
            Purchases: {num(k.purchases)} • Transfer In: {num(k.transferIn)} • Transfer Out: {num(k.transferOut)}
          </div>
        </div>
        <div className="card">
          <div className="metric-pair">
            <div className="metric"><div className="metric-label">Assigned</div><div className="metric-value">{num(k.assigned)}</div></div>
            <div className="metric"><div className="metric-label">Expended</div><div className="metric-value">{num(k.expended)}</div></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card table-card">
        <div className="card-header">
          <h3>Recent Activities</h3>
          <button className="button" onClick={loadSummary} disabled={loading}>
            {loading?'Refreshing...':'Refresh'}
          </button>
        </div>
        <table className="table">
          <thead><tr><th>Type</th><th>Date</th><th>Base</th><th>Equipment</th><th className="right">Qty</th><th>Ref</th></tr></thead>
          <tbody>
            {(k.recent||[]).map(r=>(
              <tr key={r._id}>
                <td>{r.kind}</td>
                <td>{fmtDate(r.date)}</td>
                <td>{r.baseName || (r.fromBaseName + ' → ' + r.toBaseName)}</td>
                <td>{r.equipmentName}</td>
                <td className="right">{r.quantity}</td>
                <td>{r.reference||'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NetMovementModal open={openNM} onClose={()=>setOpenNM(false)} loading={nmLoading} data={nmData} />
    </div>
  )
}

function toQuery(f){
  const p=new URLSearchParams()
  if(f.from) p.set('from', f.from)
  if(f.to) p.set('to', f.to)
  if(f.baseId) p.set('baseId', f.baseId)
  if(f.equipmentType) p.set('equipmentType', f.equipmentType)
  return '?' + p.toString()
}
function num(n){ return typeof n==='number'?n:(n||0)}
function fmtDate(s){ return s? new Date(s).toLocaleDateString():''}
