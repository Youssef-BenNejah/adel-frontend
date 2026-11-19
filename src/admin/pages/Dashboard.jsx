import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, Wallet, Layers, Tag, Receipt } from 'lucide-react'
import { useDashboard } from '../../store/dashboardStore.js'

const STATUS_COLOR = {
  'En attente': 'bg-amber-400',
  Confirmée: 'bg-sky-400',
  Expédiée: 'bg-violet-400',
  Livrée: 'bg-sage-500',
  Annulée: 'bg-clay-300',
}

function StatCard({ icon: Icon, label, value, to }) {
  const content = (
    <div className="card-surface p-6 hover:border-clay-400/40 transition-colors">
      <Icon size={20} className="text-clay-600 mb-4" strokeWidth={1.4} />
      <p className="font-display text-3xl text-ink-900">{value}</p>
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mt-1">{label}</p>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
}

export default function Dashboard() {
  const data = useDashboard()

  if (!data) {
    return <p className="font-serif italic text-ink-400">Chargement…</p>
  }

  const {
    revenue,
    ordersCount,
    productsCount,
    customersCount,
    avgOrder,
    activePromosCount,
    categoriesCount,
    pendingOrdersCount,
    last7Days,
    statusCounts,
    topProducts,
    recentOrders,
  } = data

  const maxDay = Math.max(1, ...last7Days.map((d) => d.total))

  return (
    <div>
      <h1 className="font-display text-3xl text-ink-900 mb-8">Tableau de bord</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard icon={Wallet} label="Chiffre d'affaires" value={`${revenue} TND`} />
        <StatCard icon={ShoppingCart} label="Commandes" value={ordersCount} to="/admin/commandes" />
        <StatCard icon={Package} label="Produits" value={productsCount} to="/admin/produits" />
        <StatCard icon={Users} label="Clients" value={customersCount} to="/admin/clients" />
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <StatCard icon={Receipt} label="Panier moyen" value={`${avgOrder} TND`} />
        <StatCard icon={Tag} label="Promotions actives" value={activePromosCount} to="/admin/promotions" />
        <StatCard icon={Layers} label="Catégories" value={categoriesCount} to="/admin/categories" />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mb-12">
        {/* revenue last 7 days */}
        <div className="card-surface p-6">
          <h2 className="font-display text-lg text-ink-900 mb-6">Revenu — 7 derniers jours</h2>
          <div className="flex items-end justify-between gap-2 h-36">
            {last7Days.map(({ date, total }, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                {total > 0 && <span className="font-mono text-[10px] text-clay-700">{total}</span>}
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-clay-500/80 hover:bg-clay-500 transition-colors"
                  style={{ height: `${Math.max(4, (total / maxDay) * 100)}%` }}
                  title={`${total} TND`}
                />
                <span className="font-mono text-[10px] uppercase text-ink-400">{dayLabel(date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* order status breakdown */}
        <div className="card-surface p-6">
          <h2 className="font-display text-lg text-ink-900 mb-6">Commandes par statut</h2>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLOR[status]}`} />
                <span className="font-sans text-sm text-ink-700 flex-1">{status}</span>
                <span className="font-mono text-xs text-ink-500">{count}</span>
              </div>
            ))}
            {ordersCount === 0 && <p className="font-serif italic text-ink-400 text-sm">Aucune commande pour l'instant.</p>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5 mb-12">
        {/* top products */}
        <div className="card-surface">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-900/10">
            <h2 className="font-display text-lg text-ink-900">Meilleures ventes</h2>
          </div>
          {topProducts.length === 0 ? (
            <p className="font-serif italic text-ink-400 text-center py-10">Aucune vente pour l'instant.</p>
          ) : (
            <div className="divide-y divide-ink-900/5">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="font-mono text-[11px] text-clay-600 w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm text-ink-800 flex-1 truncate">{p.name}</span>
                  <span className="font-mono text-xs text-ink-500 shrink-0">{p.qty} vendus</span>
                  <span className="font-mono text-xs text-ink-800 shrink-0 w-16 text-right">{p.revenue} TND</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* recent orders */}
        <div className="card-surface">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-900/10">
            <h2 className="font-display text-lg text-ink-900">Commandes récentes</h2>
            {pendingOrdersCount > 0 && <span className="font-mono text-[11px] text-clay-700">{pendingOrdersCount} en attente</span>}
            <Link to="/admin/commandes" className="font-mono text-[11px] uppercase tracking-widest text-clay-700 hover:text-clay-600">
              Tout voir
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-serif italic text-ink-400 text-center py-14">Aucune commande pour l'instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
                    <th className="px-6 py-3 font-normal">Référence</th>
                    <th className="px-6 py-3 font-normal">Client</th>
                    <th className="px-6 py-3 font-normal">Total</th>
                    <th className="px-6 py-3 font-normal">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-ink-900/10">
                      <td className="px-6 py-3 font-mono text-xs text-clay-700">{o.id}</td>
                      <td className="px-6 py-3 text-ink-800">{o.customer?.name || '—'}</td>
                      <td className="px-6 py-3 font-mono text-ink-800">{o.total} TND</td>
                      <td className="px-6 py-3">
                        <span className="font-mono text-[11px] px-2 py-1 rounded-full bg-ink-900/5 text-ink-700">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
