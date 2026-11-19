import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { adminLogin, useAdminSession } from '../../store/adminAuthStore.js'

export default function AdminLogin() {
  const session = useAdminSession()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (session.loggedIn && session.accessToken) return <Navigate to="/admin" replace />

  async function submit(e) {
    e.preventDefault()
    setError('')
    const ok = await adminLogin(username, password)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Identifiants incorrects.')
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-cream-50 p-8 rounded-3xl border border-ink-900/10 shadow-lift">
        <div className="flex flex-col items-center mb-8">
          <img src="/brand/logo-icon-color.png" alt="" className="w-14 h-14 object-contain mb-3" />
          <h1 className="font-display text-2xl text-ink-900">Administration</h1>
          <p className="font-mono text-[11px] text-ink-400 tracking-widest mt-1">ADEL FRAGRANCES</p>
        </div>

        {error && <p className="font-mono text-xs text-clay-700 bg-clay-50 border border-clay-200 rounded-xl px-3 py-2 mb-4">{error}</p>}

        <label className="block mb-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Identifiant</span>
          <input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-ink-900/15 bg-cream-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-clay-400"
          />
        </label>
        <label className="block mb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink-900/15 bg-cream-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-clay-400"
          />
        </label>

        <button type="submit" className="btn-clay w-full">
          Se connecter
        </button>
        <p className="font-mono text-[10px] text-ink-400 text-center mt-5">Démo : admin / adel2026</p>
      </form>
    </div>
  )
}
