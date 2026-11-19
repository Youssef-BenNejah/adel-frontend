import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const pages = []
  const add = (p) => pages.push(p)
  const windowSize = 1

  add(1)
  for (let p = page - windowSize; p <= page + windowSize; p++) {
    if (p > 1 && p < pageCount) add(p)
  }
  if (pageCount > 1) add(pageCount)

  const deduped = [...new Set(pages)].sort((a, b) => a - b)

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-900/15 text-ink-600 hover:border-clay-400 hover:text-clay-600 disabled:opacity-30 disabled:hover:border-ink-900/15 disabled:hover:text-ink-600 transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft size={15} />
      </button>

      {deduped.map((p, i) => {
        const prev = deduped[i - 1]
        const showGap = prev && p - prev > 1
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showGap && <span className="font-mono text-xs text-ink-300 px-1">…</span>}
            <button
              onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-mono text-xs transition-colors ${
                p === page ? 'bg-clay-500 text-cream-50' : 'text-ink-600 hover:bg-clay-50 hover:text-clay-700'
              }`}
            >
              {p}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-900/15 text-ink-600 hover:border-clay-400 hover:text-clay-600 disabled:opacity-30 disabled:hover:border-ink-900/15 disabled:hover:text-ink-600 transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  )
}
