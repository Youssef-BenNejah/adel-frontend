import { Fragment, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, Search } from 'lucide-react'
import { useOrders, updateOrderStatus, deleteOrder, ORDER_STATUSES } from '../../store/ordersStore.js'
import Pagination from '../../components/Pagination.jsx'

const PAGE_SIZE = 10

const STATUS_STYLE = {
  'En attente': 'bg-amber-100 text-amber-700',
  Confirmée: 'bg-sky-100 text-sky-700',
  Expédiée: 'bg-violet-100 text-violet-700',
  Livrée: 'bg-sage-100 text-sage-700',
  Annulée: 'bg-clay-100 text-clay-700',
}

export default function AdminOrders() {
  const orders = useOrders()
  const [expanded, setExpanded] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => o.id.toLowerCase().includes(q) || (o.customer?.name || '').toLowerCase().includes(q))
  }, [orders, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <h1 className="font-display text-3xl text-ink-900 mb-6">Commandes ({filtered.length})</h1>

      <div className="flex items-center gap-3 border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 mb-6 max-w-sm">
        <Search size={15} className="text-ink-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder="Rechercher une référence, un client..."
          className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
        />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal"></th>
              <th className="px-4 py-3 font-normal">Référence</th>
              <th className="px-4 py-3 font-normal">Date</th>
              <th className="px-4 py-3 font-normal">Client</th>
              <th className="px-4 py-3 font-normal">Articles</th>
              <th className="px-4 py-3 font-normal">Total</th>
              <th className="px-4 py-3 font-normal">Statut</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => (
              <Fragment key={o.id}>
                <tr className="border-t border-ink-900/10">
                  <td className="px-4 py-3">
                    <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-ink-400 hover:text-clay-600">
                      {expanded === o.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-clay-700">{o.id}</td>
                  <td className="px-4 py-3 text-ink-500 font-mono text-xs">{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-ink-800">{o.customer?.name || '—'}</td>
                  <td className="px-4 py-3 text-ink-500">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-4 py-3 font-mono text-ink-800">{o.total} TND</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className={`font-mono text-[11px] px-2 py-1 outline-none border-0 rounded-sm ${STATUS_STYLE[o.status] || ''}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-cream-50 text-ink-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteOrder(o.id)} className="text-ink-400 hover:text-clay-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="bg-ink-900/[0.02]">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-2">Articles</p>
                          {o.items.map((i) => (
                            <div key={i.id} className="flex justify-between text-sm text-ink-600 py-1">
                              <span>
                                {i.name} × {i.qty}
                              </span>
                              <span className="font-mono">{i.price * i.qty} TND</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-2">Livraison</p>
                          <p className="text-sm text-ink-600">{o.customer?.phone}</p>
                          <p className="text-sm text-ink-600">
                            {o.customer?.address}, {o.customer?.city}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center font-serif italic text-ink-400">
                  Aucune commande pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}
