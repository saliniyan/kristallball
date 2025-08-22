import { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [assignForm, setAssignForm] = useState({
    date: "",
    baseId: "",
    equipmentTypeId: "",
    quantity: "",
    assignedTo: "",
    reference: "",
  });
  const [bases, setBases] = useState([]);
  const [eqTypes, setEqTypes] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [b, e, a] = await Promise.all([
      axios.get("/api/bases"),
      axios.get("/api/equipmentTypes"),
      axios.get("/api/assignments"),
    ]);
    setBases(b.data);
    setEqTypes(e.data);
    setAssignments(a.data);
  }

  async function submitAssign(e) {
    e.preventDefault();
    await axios.post("/api/assignments", assignForm);
    setAssignForm({
      date: "",
      baseId: "",
      equipmentTypeId: "",
      quantity: "",
      assignedTo: "",
      reference: "",
    });
    fetchData();
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", background: "#fff" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600" }}>Assign Equipment</h2>

      {/* Form */}
      <form
        onSubmit={submitAssign}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "24px",
          background: "#f9f9f9",
          padding: "16px",
          borderRadius: "6px",
          border: "1px solid #eee",
        }}
      >
        <input
          type="date"
          value={assignForm.date}
          onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
          style={inputStyle}
        />
        <select
          value={assignForm.baseId}
          onChange={(e) => setAssignForm({ ...assignForm, baseId: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={assignForm.equipmentTypeId}
          onChange={(e) => setAssignForm({ ...assignForm, equipmentTypeId: e.target.value })}
          style={inputStyle}
        >
          <option value="">Equipment Type</option>
          {eqTypes.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={assignForm.quantity}
          onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Assigned To"
          value={assignForm.assignedTo}
          onChange={(e) => setAssignForm({ ...assignForm, assignedTo: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Reference"
          value={assignForm.reference}
          onChange={(e) => setAssignForm({ ...assignForm, reference: e.target.value })}
          style={inputStyle}
        />

        <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
          <button
            type="submit"
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>

      {/* Assignments Table */}
      <h3 style={{ marginBottom: "12px", fontSize: "18px" }}>Assignments List</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          border: "1px solid #ddd",
        }}
      >
        <thead style={{ background: "#f1f1f1" }}>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Base</th>
            <th style={thStyle}>Equipment</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Assigned To</th>
            <th style={thStyle}>Reference</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{a.date?.slice(0, 10)}</td>
              <td style={tdStyle}>{a.base?.name}</td>
              <td style={tdStyle}>{a.equipmentType?.name}</td>
              <td style={tdStyle}>{a.quantity}</td>
              <td style={tdStyle}>{a.assignedTo}</td>
              <td style={tdStyle}>{a.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Reusable inline styles
const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%",
};

const thStyle = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
  fontSize: "14px",
};

const tdStyle = {
  padding: "8px",
  fontSize: "14px",
};
