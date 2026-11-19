import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../store/productsStore.js'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 12

export default function SearchResults() {
  const [params] = useSearchParams()
  const allProducts = useProducts()
  const q = (params.get('q') || '').trim().toLowerCase()
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [q])

  const results = useMemo(() => {
    if (!q) return []
    return allProducts.filter((p) => p.name.toLowerCase().includes(q) || p.family.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }, [allProducts, q])

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="section-pad py-10 sm:py-14">
      <span className="eyebrow">Recherche</span>
      <h1 className="heading-display text-4xl sm:text-5xl mt-2 mb-2">&ldquo;{params.get('q')}&rdquo;</h1>
      <p className="font-mono text-xs text-ink-400 mb-10">{results.length} résultat{results.length > 1 ? 's' : ''}</p>

      {results.length === 0 ? (
        <p className="font-serif italic text-ink-400 py-10">Aucun parfum ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </>
      )}
    </div>
  )
}
