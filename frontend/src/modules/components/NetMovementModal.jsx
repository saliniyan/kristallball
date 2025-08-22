import React from 'react'

export default function NetMovementModal({ open, onClose, loading, data }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="kpi">
          <h3>Net Movement Details</h3>
          <button className="button" onClick={onClose}>Close</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="grid cols-3">
            <div className="card">
              <div className="metric-label">Purchases</div>
              <table className="table">
                <thead><tr><th>Date</th><th>Base</th><th>Equipment</th><th>Qty</th></tr></thead>
                <tbody>
                  {data?.purchases?.map(x => (
                    <tr key={x._id}><td>{fmtDate(x.date)}</td><td>{x.baseName}</td><td>{x.equipmentName}</td><td>{x.quantity}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="metric-label">Transfers In</div>
              <table className="table">
                <thead><tr><th>Date</th><th>From</th><th>To</th><th>Equipment</th><th>Qty</th></tr></thead>
                <tbody>
                  {data?.transferIn?.map(x => (
                    <tr key={x._id}><td>{fmtDate(x.date)}</td><td>{x.fromBaseName}</td><td>{x.toBaseName}</td><td>{x.equipmentName}</td><td>{x.quantity}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="metric-label">Transfers Out</div>
              <table className="table">
                <thead><tr><th>Date</th><th>From</th><th>To</th><th>Equipment</th><th>Qty</th></tr></thead>
                <tbody>
                  {data?.transferOut?.map(x => (
                    <tr key={x._id}><td>{fmtDate(x.date)}</td><td>{x.fromBaseName}</td><td>{x.toBaseName}</td><td>{x.equipmentName}</td><td>{x.quantity}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function fmtDate(s) { return s ? new Date(s).toLocaleDateString() : '' }
