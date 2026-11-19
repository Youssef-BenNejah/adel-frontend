import { useSyncExternalStore } from 'react'
import { api, setAdminToken, setUnauthorizedHandler, ApiError } from '../api/client.js'

const KEY = 'adel_admin_session_v1'
const listeners = new Set()

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return { loggedIn: false, username: null, accessToken: null }
}

let session = read()
setAdminToken(session.accessToken)

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // storage unavailable — session still works for this tab
  }
}

function emit() {
  listeners.forEach((l) => l())
}

function setSession(next) {
  session = next
  setAdminToken(session.accessToken)
  persist()
  emit()
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return session
}

export function useAdminSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export async function adminLogin(username, password) {
  try {
    const res = await api.post('/auth/admin/login', { username: username.trim(), password: password.trim() })
    setSession({ loggedIn: true, username: res.data.admin.username, accessToken: res.data.token })
    return true
  } catch (err) {
    if (err instanceof ApiError) return false
    throw err
  }
}

export async function adminLogout() {
  setSession({ loggedIn: false, username: null, accessToken: null })
  try {
    await api.postAdmin('/auth/admin/logout')
  } catch {
    // already logged out client-side — ignore network/auth errors on logout
  }
}

export function isAdminLoggedIn() {
  return session.loggedIn
}

// The admin JWT (15min expiry) has no refresh endpoint — a 401 on any admin
// call means the session is dead, so force a clean re-login instead of
// leaving the admin UI silently empty.
setUnauthorizedHandler(() => {
  if (session.loggedIn) setSession({ loggedIn: false, username: null, accessToken: null })
})
