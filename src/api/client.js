// Thin fetch wrapper around the real ADEL Fragrances backend (see
// .docs/backend-api-spec.md). Unwraps the { data, meta } / { error } envelope,
// attaches the admin bearer token when one is set, and throws ApiError with
// the server's message so callers can show it to the user.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099/api/v1'

export class ApiError extends Error {
  constructor(message, { status, code, fields } = {}) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

let adminToken = null
let onUnauthorized = null

export function setAdminToken(token) {
  adminToken = token || null
}

export function getAdminToken() {
  return adminToken
}

/** Registered by adminAuthStore — the admin JWT has no refresh path (15min expiry), so on a
 * 401 from an authenticated admin call we clear the local session instead of failing silently. */
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

function buildQuery(params) {
  if (!params) return ''
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v))
    } else {
      qs.append(key, value)
    }
  })
  const str = qs.toString()
  return str ? `?${str}` : ''
}

async function request(path, { method = 'GET', body, query, auth = false, headers } = {}) {
  const url = `${BASE_URL}${path}${buildQuery(query)}`
  const finalHeaders = { ...headers }
  let finalBody = body
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
    finalBody = JSON.stringify(body)
  }
  if (auth && adminToken) {
    finalHeaders['Authorization'] = `Bearer ${adminToken}`
  }

  let res
  try {
    res = await fetch(url, { method, headers: finalHeaders, body: finalBody, credentials: 'include' })
  } catch {
    throw new ApiError('Impossible de contacter le serveur. Vérifiez que le backend est démarré.', { status: 0 })
  }

  if (res.status === 204) return null

  const text = await res.text()
  const json = text ? JSON.parse(text) : null

  if (!res.ok) {
    const err = json?.error || {}
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized()
    throw new ApiError(err.message || `Erreur ${res.status}`, { status: res.status, code: err.code, fields: err.fields })
  }

  return json
}

export const api = {
  get: (path, query) => request(path, { method: 'GET', query }),
  getAdmin: (path, query) => request(path, { method: 'GET', query, auth: true }),
  post: (path, body) => request(path, { method: 'POST', body }),
  postAdmin: (path, body) => request(path, { method: 'POST', body, auth: true }),
  patch: (path, body) => request(path, { method: 'PATCH', body, auth: true }),
  put: (path, body) => request(path, { method: 'PUT', body, auth: true }),
  delete: (path) => request(path, { method: 'DELETE', auth: true }),
  postAdminForm: (path, formData) => request(path, { method: 'POST', body: formData, auth: true }),
}
