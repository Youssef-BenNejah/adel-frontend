import { useEffect, useMemo, useState } from 'react'
import { Plus, X, Search, Check, Sparkles, ArrowRight, ArrowLeft, Package } from 'lucide-react'
import { useProducts } from '../store/productsStore.js'
import { useActivePacks } from '../store/packsStore.js'
import { getProductImage, productImages } from '../data/images.js'
import { useCart } from '../context/CartContext.jsx'

export default function Packs() {
  const allProducts = useProducts()
  const packs = useActivePacks()
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (!selectedId && packs.length === 1) setSelectedId(packs[0].id)
  }, [packs, selectedId])

  const selectedPack = packs.find((p) => p.id === selectedId) || null

  if (packs.length === 0) {
    return (
      <div className="section-pad py-20 flex flex-col items-center text-center gap-4">
        <Package size={40} className="text-ink-200" strokeWidth={1} />
        <h1 className="heading-display text-3xl">Aucun pack disponible</h1>
        <p className="font-serif italic text-ink-500">Revenez bientôt pour composer votre pack.</p>
      </div>
    )
  }

  if (!selectedPack) {
    return <PackPicker packs={packs} onSelect={setSelectedId} productsCount={allProducts.length} />
  }

  return <PackComposer pack={selectedPack} allProducts={allProducts} onBack={() => setSelectedId(packs.length > 1 ? null : selectedId)} showBack={packs.length > 1} />
}

function PackPicker({ packs, onSelect, productsCount }) {
  return (
    <div className="section-pad py-14 sm:py-20">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="eyebrow inline-flex items-center gap-2 justify-center">
          <Sparkles size={13} /> Offres exclusives
        </span>
        <h1 className="heading-display text-4xl sm:text-6xl mt-4">Nos Packs</h1>
        <p className="font-serif italic text-ink-500 mt-4 text-xl">Choisissez un pack et composez-le parmi {productsCount} références.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => onSelect(pack.id)}
            className="group text-left card-surface p-8 hover:border-clay-400/50 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
          >
            <span className="eyebrow">{pack.size} extraits</span>
            <h3 className="font-display text-2xl text-ink-900 mt-2 mb-2">{pack.name}</h3>
            <p className="font-sans text-sm text-ink-500 mb-6">
              {pack.scope === 'all' ? 'Parmi toute la collection' : `Parmi ${pack.productIds.length} références sélectionnées`}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl text-clay-700">{pack.price} TND</span>
              <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-clay-700 group-hover:translate-x-1 transition-transform">
                Composer <ArrowRight size={14} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function PackComposer({ pack, allProducts, onBack, showBack }) {
  const [slots, setSlots] = useState(Array.from({ length: pack.size }, () => null))
  const [activeSlot, setActiveSlot] = useState(null)
  const [query, setQuery] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    setSlots(Array.from({ length: pack.size }, () => null))
  }, [pack.id, pack.size])

  const eligible = useMemo(
    () => (pack.scope === 'products' ? allProducts.filter((p) => pack.productIds.includes(p.id)) : allProducts),
    [allProducts, pack]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return eligible.slice(0, 48)
    return eligible.filter((p) => p.name.toLowerCase().includes(q) || p.family.toLowerCase().includes(q)).slice(0, 48)
  }, [eligible, query])

  const filled = slots.filter(Boolean).length

  function pick(product) {
    setSlots((prev) => {
      const next = [...prev]
      next[activeSlot] = product
      return next
    })
    setActiveSlot(null)
    setQuery('')
  }

  function clearSlot(i) {
    setSlots((prev) => {
      const next = [...prev]
      next[i] = null
      return next
    })
  }

  function addPackToCart() {
    addItem({
      id: `custom-pack-${pack.id}-` + slots.map((s) => s?.id).join('-'),
      sku: 'PACK',
      name: `${pack.name} (${slots.map((s) => s.name).join(', ')})`,
      price: pack.price,
      image: slots[0] ? getProductImage(slots[0].id) : productImages[0],
      meta: { type: 'pack', packId: pack.id, slotProductIds: slots.map((s) => s.id) },
    })
    setSlots(Array.from({ length: pack.size }, () => null))
  }

  return (
    <div className="section-pad py-14 sm:py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        {showBack && (
          <button onClick={onBack} className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-500 hover:text-clay-600 mb-6">
            <ArrowLeft size={14} /> Changer de pack
          </button>
        )}
        <span className="eyebrow inline-flex items-center gap-2 justify-center">
          <Sparkles size={13} /> Offre exclusive
        </span>
        <h1 className="heading-display text-4xl sm:text-6xl mt-4">{pack.name}</h1>
        <p className="font-serif italic text-ink-500 mt-4 text-xl">
          Choisissez {pack.size} extraits parmi {eligible.length} références — {pack.price} TND le pack, 30ml chaque.
        </p>
      </div>

      <div
        className="grid md:[grid-template-columns:repeat(var(--pack-cols),minmax(0,1fr))_auto] gap-5 items-stretch max-w-5xl mx-auto"
        style={{ '--pack-cols': pack.size }}
      >
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={() => setActiveSlot(i)}
            className={`relative group border border-dashed rounded-3xl p-6 h-72 flex flex-col items-center justify-center gap-3 transition-all duration-300 overflow-hidden
              ${slot ? 'border-clay-400 bg-cream-50' : 'border-ink-900/20 hover:border-clay-400 hover:bg-cream-50'}`}
          >
            <span className="absolute top-4 left-4 font-mono text-[11px] text-clay-600/80 z-10">0{i + 1}</span>
            {slot && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  clearSlot(i)
                }}
                className="absolute top-3 right-3 z-10 text-ink-400 hover:text-clay-600 bg-cream-50/80 rounded-full p-1 cursor-pointer"
              >
                <X size={15} />
              </span>
            )}

            {slot ? (
              <>
                <img src={slot.image || getProductImage(slot.id)} alt={slot.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
                <p className="relative mt-auto font-display text-lg text-center leading-tight text-cream-50">{slot.name}</p>
                <p className="relative font-mono text-[10px] text-clay-200 tracking-widest">{slot.sku}</p>
              </>
            ) : (
              <>
                <span className="w-12 h-12 rounded-full border border-ink-900/20 flex items-center justify-center group-hover:border-clay-500 group-hover:scale-105 transition-all">
                  <Plus size={18} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400">Choisir un extrait</span>
              </>
            )}
          </button>
        ))}

        <div className="border border-clay-400/40 bg-cream-50 rounded-3xl p-7 h-72 flex flex-col justify-between md:w-60">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400">Total pack</span>
            <p className="font-display text-5xl mt-3 text-clay-700">{filled === pack.size ? pack.price : '—'}</p>
            <p className="font-mono text-xs text-ink-400 mt-1">TND · {pack.size} × 30ml</p>
          </div>
          <button
            disabled={filled !== pack.size}
            onClick={addPackToCart}
            className="btn-clay w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-clay-500 disabled:hover:shadow-none"
          >
            {filled === pack.size ? (
              <>
                Ajouter au panier <ArrowRight size={16} />
              </>
            ) : (
              `${filled}/${pack.size} sélectionnés`
            )}
          </button>
        </div>
      </div>

      {activeSlot !== null && (
        <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-cream-50 border border-ink-900/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">Choisir un extrait</h3>
              <button onClick={() => setActiveSlot(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-clay-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 border-b border-ink-900/10">
              <div className="flex items-center gap-3 border border-ink-900/15 rounded-full px-4 py-2.5">
                <Search size={15} className="text-clay-600" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un parfum, une famille..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-ink-400 text-ink-900"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-ink-900/5">
              {results.map((f) => (
                <button
                  key={f.id}
                  onClick={() => pick(f)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-cream-200/50 transition-colors text-left"
                >
                  <div className="w-10 h-14 bg-cream-200 overflow-hidden shrink-0 rounded-lg">
                    <img src={f.image || getProductImage(f.id)} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-base text-ink-900">{f.name}</p>
                    <p className="font-mono text-[10px] text-ink-400 tracking-widest">
                      {f.sku} · {f.family}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-clay-700">{f.price} TND</span>
                  {slots.some((s) => s?.id === f.id) && <Check size={16} className="text-clay-600" />}
                </button>
              ))}
              {results.length === 0 && <p className="text-center py-10 text-ink-400 font-serif italic">Aucun résultat.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
