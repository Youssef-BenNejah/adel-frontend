import { NavLink } from 'react-router-dom'
import { Home, Tag, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useCategories } from '../../store/categoriesStore.js'

export default function BottomTabBar() {
  const { count } = useCart()
  const categories = useCategories()

  const ITEMS = [
    { to: '/', label: 'Accueil', icon: Home, end: true },
    ...categories.slice(0, 3).map((c) => ({ to: `/categorie/${c.slug}`, label: c.label, icon: Tag })),
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-50/95 backdrop-blur border-t border-ink-900/10 rounded-t-3xl shadow-[0_-8px_30px_-15px_rgba(43,35,32,0.2)] flex items-stretch">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 ${
              isActive ? 'text-clay-600' : 'text-ink-400'
            }`
          }
        >
          <Icon size={18} strokeWidth={1.5} />
          <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
        </NavLink>
      ))}
      <NavLink
        to="/panier"
        className={({ isActive }) =>
          `flex-1 relative flex flex-col items-center justify-center gap-1 py-2.5 ${
            isActive ? 'text-clay-600' : 'text-ink-400'
          }`
        }
      >
        <ShoppingBag size={18} strokeWidth={1.5} />
        {count > 0 && (
          <span className="absolute top-1 right-1/3 bg-clay-500 text-cream-50 text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
        <span className="font-mono text-[9px] uppercase tracking-wider">Panier</span>
      </NavLink>
    </nav>
  )
}
