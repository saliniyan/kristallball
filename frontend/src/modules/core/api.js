import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kristallball.onrender.com'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

function getAuthToken() {
  try {
    const raw = sessionStorage.getItem('auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch { return null }
}

instance.interceptors.request.use(cfg => {
  const token = getAuthToken()
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`
  return cfg
})

export const api = {
  get: (p, opts) => instance.get(p, opts).then(r=>r.data),
  post: (p, data, opts) => instance.post(p, data, opts).then(r=>r.data),
  put: (p, data, opts) => instance.put(p, data, opts).then(r=>r.data),
  del: (p, opts) => instance.delete(p, opts).then(r=>r.data),
  instance
}
