import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ExternalLink,
  Tag,
  GalleryHorizontalEnd,
  Layers,
  Menu,
  X,
  Gift,
} from 'lucide-react'
import { adminLogout, useAdminSession } from '../store/adminAuthStore.js'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/categories', label: 'Catégories', icon: Layers },
  { to: '/admin/packs', label: 'Packs', icon: Gift },
  { to: '/admin/promotions', label: 'Promotions', icon: Tag },
  { to: '/admin/accueil', label: "Page d'accueil", icon: GalleryHorizontalEnd },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout() {
  const session = useAdminSession()
  const [navOpen, setNavOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="px-6 py-6 border-b border-ink-900/10 flex items-center justify-between">
        <div>
          <img src="/brand/logo-horizontal-color.png" alt="Adel Fragrances" className="h-7 w-auto mb-1.5" />
          <p className="font-mono text-[10px] text-clay-600 tracking-widest">ADMINISTRATION</p>
        </div>
        <button onClick={() => setNavOpen(false)} className="lg:hidden text-ink-500 hover:text-clay-600 p-1" aria-label="Fermer le menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? 'bg-clay-50 text-clay-700' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-900/5'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-6 border-t border-ink-900/10 flex flex-col gap-1">
        <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-500 hover:text-ink-900 hover:bg-ink-900/5">
          <ExternalLink size={16} strokeWidth={1.5} />
          Voir la boutique
        </Link>
        <button onClick={adminLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-500 hover:text-ink-900 hover:bg-ink-900/5 text-left">
          <LogOut size={16} strokeWidth={1.5} />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900 flex">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-ink-900/10 bg-cream-50 flex-col">{sidebarContent}</aside>

      {/* mobile drawer */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setNavOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[82vw] bg-cream-50 rounded-r-3xl shadow-lift flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-ink-900/10 bg-cream-50 flex items-center justify-between px-4 sm:px-8 gap-4">
          <button onClick={() => setNavOpen(true)} className="lg:hidden text-ink-700 p-1 shrink-0" aria-label="Ouvrir le menu">
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <span className="font-mono text-xs text-clay-700 ml-auto">{session.username}</span>
        </header>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
