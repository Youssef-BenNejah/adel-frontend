import { useMemo, useState } from 'react'
import { Plus, Trash2, X, UserRound, Search } from 'lucide-react'
import { useCustomers, addCustomer, deleteCustomer } from '../../store/customersStore.js'
import Pagination from '../../components/Pagination.jsx'

const EMPTY_FORM = { name: '', email: '', phone: '', password: '' }
const PAGE_SIZE = 10

export default function AdminCustomers() {
  const customers = useCustomers()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }, [customers, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await addCustomer(form)
      setForm(EMPTY_FORM)
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-display text-3xl text-ink-900">Clients ({filtered.length})</h1>
        <button onClick={() => setModalOpen(true)} className="btn-clay !py-2.5">
          <Plus size={16} /> Créer un compte client
        </button>
      </div>

      <div className="flex items-center gap-3 border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 mb-6 max-w-sm">
        <Search size={15} className="text-ink-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder="Rechercher un nom, un e-mail..."
          className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
        />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal">Client</th>
              <th className="px-4 py-3 font-normal">E-mail</th>
              <th className="px-4 py-3 font-normal">Téléphone</th>
              <th className="px-4 py-3 font-normal">Créé le</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-ink-900/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-clay-50 flex items-center justify-center text-clay-700 font-display">
                      {c.name[0]}
                    </span>
                    <div>
                      <p className="text-ink-900">{c.name}</p>
                      <p className="font-mono text-[10px] text-ink-400">{c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600">{c.email}</td>
                <td className="px-4 py-3 text-ink-600">{c.phone || '—'}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-500">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setConfirmDelete(c)} className="text-ink-400 hover:text-clay-600">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <UserRound size={28} className="text-ink-200 mx-auto mb-3" strokeWidth={1} />
                  <p className="font-serif italic text-ink-400">Aucun compte client pour l'instant.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submit} className="bg-cream-50 border border-ink-900/10 shadow-soft w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">Créer un compte client</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-ink-500 hover:text-clay-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="font-mono text-xs text-clay-700 bg-clay-50 px-3 py-2">{error}</p>}
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Nom complet</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">E-mail</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-input" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Téléphone</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="admin-input" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Mot de passe temporaire</span>
                <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="admin-input" />
              </label>
            </div>
            <div className="px-6 py-5 border-t border-ink-900/10 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button type="submit" className="btn-clay !py-2.5">
                Créer le compte
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 border border-ink-900/10 shadow-soft w-full max-w-sm p-6">
            <h3 className="font-display text-lg text-ink-900 mb-2">Supprimer « {confirmDelete.name} » ?</h3>
            <p className="font-sans text-sm text-ink-500 mb-6">Le compte sera définitivement supprimé.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteCustomer(confirmDelete.id)
                  setConfirmDelete(null)
                }}
                className="font-mono text-xs uppercase tracking-widest bg-clay-600 text-cream-50 px-4 py-2.5"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
