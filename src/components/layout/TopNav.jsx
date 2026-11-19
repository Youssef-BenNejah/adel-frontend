import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useProducts } from '../../store/productsStore.js'
import { useCategories } from '../../store/categoriesStore.js'
import { getProductImage } from '../../data/images.js'

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { count } = useCart()
  const navigate = useNavigate()
  const allProducts = useProducts()
  const categories = useCategories()

  const NAV = useMemo(
    () => [
      { label: 'Accueil', to: '/', end: true },
      ...categories.map((c) => ({ label: c.label, to: `/categorie/${c.slug}` })),
      { label: 'Packs', to: '/packs' },
    ],
    [categories]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allProducts.filter((p) => p.name.toLowerCase().includes(q) || p.family.toLowerCase().includes(q)).slice(0, 5)
  }, [allProducts, query])

  function submitSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/recherche?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'pt-2' : 'pt-0'
      }`}
    >
      <div
        className={`section-pad flex items-center h-20 gap-6 transition-all duration-300 ${
          scrolled ? 'bg-cream-50/90 backdrop-blur-md mx-3 sm:mx-6 lg:mx-10 rounded-full shadow-card border border-ink-900/5 px-6' : 'bg-cream-100/90 backdrop-blur-md'
        }`}
      >
        <button className="lg:hidden text-ink-900" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <Menu size={22} strokeWidth={1.5} />
        </button>

        <Link to="/" className="shrink-0 flex items-center">
          <img src="/brand/logo-horizontal-color.png" alt="Adel Fragrances" className="h-7 sm:h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `relative px-4 py-2 font-sans text-[13px] tracking-wide transition-colors ${
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 bg-clay-50 rounded-full -z-10" />
                  )}
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 ml-auto">
          <div className="relative">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Rechercher"
              className="text-ink-900 hover:text-clay-600 transition-colors"
            >
              {searchOpen ? <X size={19} strokeWidth={1.5} /> : <Search size={19} strokeWidth={1.5} />}
            </button>

            {searchOpen && (
              <form
                onSubmit={submitSearch}
                className="absolute right-0 top-12 w-[90vw] max-w-sm bg-cream-50 border border-ink-900/10 shadow-lift rounded-2xl p-3 animate-fade-up"
              >
                <div className="flex items-center gap-2 border border-ink-900/15 rounded-full px-4 py-2.5">
                  <Search size={14} className="text-clay-600 shrink-0" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Rechercher un parfum, une note..."
                    className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="mt-2 divide-y divide-ink-900/5 max-h-80 overflow-y-auto">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        to={`/produit/${p.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 py-2.5 hover:bg-cream-200/50 px-2 rounded-xl"
                      >
                        <img src={getProductImage(p.id)} alt="" className="w-7 h-9 object-cover shrink-0 rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm text-ink-900 truncate">{p.name}</p>
                          <p className="font-mono text-[10px] text-ink-400">{p.sku}</p>
                        </div>
                        <span className="font-mono text-xs text-clay-700 shrink-0">{p.price} TND</span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            )}
          </div>

          <Link to="/panier" aria-label="Voir le panier" className="relative text-ink-900 hover:text-clay-600 transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-clay-500 text-cream-50 text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

    </header>

    {/* mobile slide-in drawer — rendered outside the (backdrop-blurred) header so
        `fixed inset-0` sizes against the viewport, not the header's own box */}
    {menuOpen && (
      <div className="lg:hidden fixed inset-0 z-[90]">
        <div
          className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-up"
          style={{ animationDuration: '300ms' }}
          onClick={() => setMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 h-full w-[78vw] max-w-[300px] bg-cream-50 rounded-l-3xl shadow-lift overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 shrink-0">
            <img src="/brand/logo-horizontal-color.png" alt="Adel Fragrances" className="h-6 w-auto" />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-ink-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 pt-2 pb-6">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-sans text-[15px] px-3 py-3 rounded-xl transition-colors ${
                    isActive ? 'text-clay-700 bg-clay-50 font-medium' : 'text-ink-700 hover:bg-cream-200/70'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    )}
    </>
  )
}
