import { useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const resources = {
  owners: ['full_name', 'phone', 'email', 'address', 'license_number', 'license_status'],
  officers: ['name', 'badge_number', 'assigned_area'],
  vehicles: ['registration_number', 'owner_id', 'vehicle_type', 'model', 'color', 'is_blacklisted'],
  'violation-types': ['violation_name', 'base_fine'],
  violations: ['vehicle_id', 'officer_id', 'violation_type_id', 'violation_date', 'location', 'status'],
  fines: ['violation_id', 'amount', 'issued_date', 'due_date'],
  payments: ['fine_id', 'amount_paid', 'payment_date', 'payment_method'],
  blacklist: ['vehicle_id', 'reason', 'blacklisted_date'],
}

const pretty = (value) => String(value).replace(/_/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase())

function buildPayload(fields, values) {
  const payload = {}
  fields.forEach((field) => {
    const raw = values[field]
    if (raw === '' || raw === undefined) {
      return
    }

    if (raw === 'true') {
      payload[field] = true
      return
    }

    if (raw === 'false') {
      payload[field] = false
      return
    }

    const numericFields = ['owner_id', 'vehicle_id', 'officer_id', 'violation_type_id', 'violation_id', 'fine_id', 'amount', 'amount_paid', 'base_fine']
    if (numericFields.includes(field) && !Number.isNaN(Number(raw))) {
      payload[field] = Number(raw)
      return
    }

    payload[field] = raw
  })
  return payload
}

function App() {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'CLERK' })
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [activeResource, setActiveResource] = useState('owners')
  const [rows, setRows] = useState([])
  const [editId, setEditId] = useState('')
  const [formValues, setFormValues] = useState({})
  const [status, setStatus] = useState('Welcome to Traffic Enforcement Console')

  const fields = useMemo(() => resources[activeResource], [activeResource])

  async function api(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(payload.error || 'Request failed')
    }
    return payload
  }

  async function register() {
    try {
      const payload = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      setStatus(`User ${payload.username} registered successfully`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function login() {
    try {
      const payload = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
      })
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify(payload.user))
      setToken(payload.token)
      setUser(payload.user)
      setStatus(`Welcome, ${payload.user.username}`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    setRows([])
    setStatus('Logged out')
  }

  async function loadResource() {
    try {
      const payload = await api(`/api/${activeResource}`)
      setRows(payload)
      setStatus(`Loaded ${payload.length} rows from ${activeResource}`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function createOrUpdate() {
    try {
      const payload = buildPayload(fields, formValues)
      if (!Object.keys(payload).length) {
        setStatus('Fill at least one field before saving')
        return
      }

      if (editId) {
        await api(`/api/${activeResource}/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setStatus(`Updated row ${editId}`)
      } else {
        await api(`/api/${activeResource}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setStatus(`Created row in ${activeResource}`)
      }

      setEditId('')
      setFormValues({})
      await loadResource()
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function removeRow() {
    if (!editId) {
      setStatus('Enter a row ID to delete')
      return
    }

    try {
      await api(`/api/${activeResource}/${editId}`, { method: 'DELETE' })
      setStatus(`Deleted row ${editId}`)
      setEditId('')
      setFormValues({})
      await loadResource()
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <main className="shell">
      <div className="ambient" />
      <section className="card hero">
        <h1>Smart Traffic Enforcement</h1>
        <p className="subtext">A modern control panel for secure access and full database CRUD operations.</p>

        <div className="auth-grid">
          <input
            placeholder="Username"
            value={credentials.username}
            onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
          />
          <select
            value={credentials.role}
            onChange={(event) => setCredentials((prev) => ({ ...prev, role: event.target.value }))}
          >
            <option>ADMIN</option>
            <option>OFFICER</option>
            <option>CLERK</option>
          </select>
          <div className="buttons-row">
            <button type="button" className="primary" onClick={register}>Register</button>
            <button type="button" className="primary" onClick={login}>Login</button>
            <button type="button" className="ghost" onClick={logout}>Logout</button>
          </div>
        </div>

        <p className="status">{status}</p>
        {user ? <p className="user-pill">Signed in as {user.username} ({user.role})</p> : null}
      </section>

      <section className="card">
        <div className="toolbar">
          <select value={activeResource} onChange={(event) => setActiveResource(event.target.value)}>
            {Object.keys(resources).map((resource) => (
              <option key={resource} value={resource}>{pretty(resource)}</option>
            ))}
          </select>
          <button type="button" className="primary" onClick={loadResource} disabled={!token}>Load Data</button>
        </div>

        <div className="edit-box">
          <input
            placeholder="ID for update/delete"
            value={editId}
            onChange={(event) => setEditId(event.target.value)}
          />
          <div className="form-grid">
            {fields.map((field) => (
              <label key={field}>
                <span>{pretty(field)}</span>
                <input
                  placeholder={field}
                  value={formValues[field] || ''}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, [field]: event.target.value }))}
                />
              </label>
            ))}
          </div>
          <div className="buttons-row">
            <button type="button" className="primary" onClick={createOrUpdate} disabled={!token}>
              {editId ? 'Update' : 'Create'}
            </button>
            <button type="button" className="danger" onClick={removeRow} disabled={!token}>Delete</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {(rows[0] ? Object.keys(rows[0]) : []).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, valueIndex) => (
                    <td key={valueIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="empty">No rows loaded yet.</p> : null}
        </div>
      </section>
    </main>
  )
}

export default App
