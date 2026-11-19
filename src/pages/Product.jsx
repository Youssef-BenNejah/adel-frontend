import { useMemo, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Star, Minus, Plus, ShieldCheck, Truck, ChevronDown } from 'lucide-react'
import { useProducts, useProductsLoaded } from '../store/productsStore.js'
import { getProductImage, productImages } from '../data/images.js'
import { useCart } from '../context/CartContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

function galleryFor(product) {
  if (product.images && product.images.length) return product.images
  const main = product.image || getProductImage(product.id)
  const others = productImages.filter((img) => img !== main).slice(0, 2)
  return [main, ...others]
}

export default function Product() {
  const { id } = useParams()
  const allProducts = useProducts()
  const productsLoaded = useProductsLoaded()
  const product = useMemo(() => allProducts.find((p) => p.id === id), [allProducts, id])
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState(1)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const { addItem } = useCart()

  const gallery = useMemo(() => (product ? galleryFor(product) : []), [product])
  const related = useMemo(
    () => (product ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : []),
    [allProducts, product]
  )

  if (!product) return productsLoaded ? <Navigate to="/" replace /> : null

  const chosenSize = product.sizes[size]
  const promo = product.appliedPromo
  const chosenOriginalPrice = chosenSize.price
  const chosenPrice = promo
    ? promo.discountType === 'percent'
      ? Math.max(0, Math.round(chosenSize.price * (1 - promo.value / 100)))
      : Math.max(0, Math.round(chosenSize.price - promo.value))
    : chosenSize.price

  return (
    <div>
      <div className="section-pad pt-6 pb-2">
        <p className="font-mono text-[11px] text-ink-400 tracking-widest">
          <Link to="/" className="hover:text-clay-600">
            Accueil
          </Link>{' '}
          /{' '}
          <Link to={`/categorie/${product.category}`} className="hover:text-clay-600 uppercase">
            {product.category}
          </Link>{' '}
          / {product.sku}
        </p>
      </div>

      <div className="section-pad py-8 grid lg:grid-cols-2 gap-12">
        {/* gallery */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="aspect-[4/5] bg-cream-200 overflow-hidden mb-4 rounded-3xl shadow-card">
            <img src={gallery[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-24 overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImg === i ? 'border-clay-500' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <p className="font-mono text-[11px] text-clay-600 tracking-widest mb-2">{product.sku}</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink-900 mb-2">{product.name}</h1>
          <p className="font-serif italic text-xl text-ink-500 mb-4">{product.family}</p>

          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(product.rating) ? 'fill-clay-500 text-clay-500' : 'text-ink-200'} />
              ))}
            </div>
            <span className="font-mono text-xs text-ink-400">
              {product.rating} · {product.reviews} avis
            </span>
          </div>

          <dl className="space-y-2 mb-8 font-mono text-xs text-ink-600 border-y border-ink-900/10 py-5">
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 text-clay-600 tracking-widest">TÊTE</dt>
              <dd>{product.notes.top}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 text-clay-600 tracking-widest">CŒUR</dt>
              <dd>{product.notes.heart}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 text-clay-600 tracking-widest">FOND</dt>
              <dd>{product.notes.base}</dd>
            </div>
          </dl>

          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-3">Contenance</p>
            <div className="flex gap-3">
              {product.sizes.map((s, i) => (
                <button
                  key={s.ml}
                  onClick={() => setSize(i)}
                  className={`px-5 py-3 border rounded-full font-mono text-sm transition-colors ${
                    size === i ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600 hover:border-ink-900/30'
                  }`}
                >
                  {s.ml}ml
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-ink-900/15 rounded-full overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-clay-600">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-mono text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-clay-600">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              {promo && <span className="font-mono text-base text-ink-300 line-through">{chosenOriginalPrice * qty} TND</span>}
              <span className="font-display text-3xl text-clay-700">{chosenPrice * qty} TND</span>
            </div>
          </div>
          {promo && (
            <p className="font-mono text-xs text-clay-700 bg-clay-50 inline-block px-3 py-1.5 rounded-full mb-4">
              {promo.discountType === 'percent' ? `-${promo.value}%` : `-${promo.value} TND`} · {promo.label}
            </p>
          )}

          <button
            onClick={() =>
              addItem(
                {
                  ...product,
                  id: `${product.id}-${chosenSize.ml}`,
                  name: `${product.name} — ${chosenSize.ml}ml`,
                  price: chosenPrice,
                  image: gallery[0],
                  meta: { type: 'product', productId: product.id, sizeMl: chosenSize.ml },
                },
                qty
              )
            }
            className="btn-clay w-full mb-6"
          >
            Ajouter au panier
          </button>

          <div className="flex items-center gap-6 text-ink-500 text-xs font-sans mb-10">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-clay-600" /> Paiement à la livraison
            </span>
            <span className="flex items-center gap-2">
              <Truck size={15} className="text-clay-600" /> Livraison 24–48h
            </span>
          </div>

          {/* accordion tabs */}
          <div className="border-t border-ink-900/10">
            {[
              { id: 'description', label: 'Description' },
              { id: 'livraison', label: 'Livraison & retours' },
              { id: 'avis', label: `Avis (${product.reviews})` },
            ].map((t) => (
              <div key={t.id} className="border-b border-ink-900/10">
                <button
                  onClick={() => setTab(tab === t.id ? null : t.id)}
                  className="w-full flex items-center justify-between py-4 font-sans text-sm text-ink-900"
                >
                  {t.label}
                  <ChevronDown size={16} className={`transition-transform ${tab === t.id ? 'rotate-180' : ''}`} />
                </button>
                {tab === t.id && (
                  <p className="pb-4 font-sans text-sm text-ink-500 leading-relaxed whitespace-pre-line">
                    {t.id === 'description' &&
                      (product.description ||
                        `${product.name} est un parfum ${product.family.toLowerCase()} de la maison Adel. Extrait concentré à 45%, mis en flacon artisanalement à Bizerte à partir de matières premières sélectionnées.`)}
                    {t.id === 'livraison' &&
                      'Livraison 24–48h partout en Tunisie, paiement à la livraison. Retour accepté sous 7 jours si le flacon est intact.'}
                    {t.id === 'avis' && `Note moyenne de ${product.rating}/5 sur ${product.reviews} avis vérifiés.`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="section-pad py-16 border-t border-ink-900/10">
          <h2 className="heading-display text-2xl sm:text-3xl mb-8">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
