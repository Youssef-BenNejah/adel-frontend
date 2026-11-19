import { useEffect, useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { useProducts } from '../store/productsStore.js'
import { useCategories, useCategoriesLoaded } from '../store/categoriesStore.js'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'

const SORTS = [
  { id: 'default', label: 'Pertinence' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
  { id: 'rating', label: 'Meilleures notes' },
]

const PRICE_BANDS = [
  { id: 'all', label: 'Tous les prix' },
  { id: 'lt30', label: 'Moins de 30 TND' },
  { id: '30-40', label: '30 – 40 TND' },
  { id: 'gt40', label: 'Plus de 40 TND' },
]

const PAGE_SIZE = 12

export default function Category() {
  const { slug } = useParams()
  const categories = useCategories()
  const [selectedCategories, setSelectedCategories] = useState([slug])
  const [sort, setSort] = useState('default')
  const [families, setFamilies] = useState([])
  const [priceBand, setPriceBand] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const allProducts = useProducts()
  const categoriesLoaded = useCategoriesLoaded()
  const meta = categories.find((c) => c.slug === slug)

  // reset local filters whenever the route's category changes
  useEffect(() => {
    setSelectedCategories([slug])
    setFamilies([])
    setPriceBand('all')
    setSearch('')
    setSort('default')
    setPage(1)
  }, [slug])

  const baseProducts = useMemo(
    () => allProducts.filter((p) => selectedCategories.includes(p.category)),
    [allProducts, selectedCategories]
  )

  const familyOptions = useMemo(() => [...new Set(baseProducts.map((p) => p.family))].sort(), [baseProducts])

  const filtered = useMemo(() => {
    let list = baseProducts
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.family.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    if (families.length) list = list.filter((p) => families.includes(p.family))
    if (priceBand === 'lt30') list = list.filter((p) => p.price < 30)
    if (priceBand === '30-40') list = list.filter((p) => p.price >= 30 && p.price <= 40)
    if (priceBand === 'gt40') list = list.filter((p) => p.price > 40)

    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [baseProducts, families, priceBand, sort, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleFamily(f) {
    setPage(1)
    setFamilies((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  function toggleCategory(s) {
    setPage(1)
    setSelectedCategories((prev) => {
      const next = prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
      return next.length ? next : prev
    })
  }

  function goToPage(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!meta) return categoriesLoaded ? <Navigate to="/" replace /> : null

  const filterPanelProps = {
    categories,
    selectedCategories,
    toggleCategory,
    familyOptions,
    families,
    toggleFamily,
    priceBand,
    setPriceBand: (v) => {
      setPage(1)
      setPriceBand(v)
    },
  }

  return (
    <div className="section-pad py-10 sm:py-14">
      <div className="mb-8">
        <span className="eyebrow">{baseProducts.length} références</span>
        <h1 className="heading-display text-4xl sm:text-5xl mt-2">{meta.label}</h1>
        <p className="font-serif italic text-ink-500 mt-2 text-lg">{meta.sub}</p>
      </div>

      {/* prominent search bar */}
      <div className="flex items-center gap-3 border border-ink-900/15 bg-cream-50 rounded-full px-5 py-3.5 mb-10 max-w-xl shadow-card">
        <Search size={17} className="text-clay-600 shrink-0" />
        <input
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder="Rechercher un parfum, une famille, une référence..."
          className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
        />
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        {/* filters sidebar (desktop) */}
        <aside className="hidden lg:block">
          <FilterPanel {...filterPanelProps} />
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-ink-900/15 rounded-full px-4 py-2.5 shrink-0"
            >
              <SlidersHorizontal size={14} /> Filtres
            </button>
            <p className="font-mono text-xs text-ink-400 hidden sm:block">{filtered.length} résultats</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-auto min-w-0 max-w-[45%] sm:max-w-none border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-700 outline-none focus:border-clay-400"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  Trier — {s.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="font-serif italic text-ink-400 text-center py-20">Aucun produit ne correspond à ces filtres.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {paged.map((p, i) => (
                  <ProductCard key={p.id} product={p} rank={sort === 'default' && page === 1 && i < 4 ? i + 1 : undefined} />
                ))}
              </div>

              <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
            </>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-cream-50 rounded-l-3xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-ink-900">Filtres</h3>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
            <button onClick={() => setFiltersOpen(false)} className="btn-clay w-full mt-8">
              Voir {filtered.length} résultats
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterPanel({ categories, selectedCategories, toggleCategory, familyOptions, families, toggleFamily, priceBand, setPriceBand }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-4">Catégorie</h4>
        <div className="space-y-2.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c.slug)}
                onChange={() => toggleCategory(c.slug)}
                className="accent-clay-500 w-3.5 h-3.5"
              />
              <span className="font-sans text-sm text-ink-600 group-hover:text-ink-900">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-4">Famille olfactive</h4>
        <div className="space-y-2.5">
          {familyOptions.map((f) => (
            <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={families.includes(f)}
                onChange={() => toggleFamily(f)}
                className="accent-clay-500 w-3.5 h-3.5"
              />
              <span className="font-sans text-sm text-ink-600 group-hover:text-ink-900">{f}</span>
            </label>
          ))}
          {familyOptions.length === 0 && <p className="font-sans text-xs text-ink-400">Aucune famille.</p>}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-4">Budget</h4>
        <div className="space-y-2.5">
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={priceBand === b.id}
                onChange={() => setPriceBand(b.id)}
                className="accent-clay-500 w-3.5 h-3.5"
              />
              <span className="font-sans text-sm text-ink-600 group-hover:text-ink-900">{b.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
