import { Link } from 'react-router-dom'
import { Plus, Star } from 'lucide-react'
import { getProductImage } from '../data/images.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, rank }) {
  const { addItem } = useCart()
  const promo = product.appliedPromo
  const price = product.displayPrice ?? product.price
  const originalPrice = product.originalPrice ?? product.price

  return (
    <div className="group relative card-surface hover:border-clay-400/40 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-500 ease-silk flex flex-col overflow-hidden">
      <Link to={`/produit/${product.id}`} className="relative h-32 sm:h-48 overflow-hidden bg-cream-200 block rounded-t-2xl sm:rounded-t-3xl">
        <img
          src={product.image || getProductImage(product.id)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-silk group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-start justify-between">
          {rank && <span className="font-mono text-[10px] sm:text-[11px] bg-cream-50/90 text-clay-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">N°{rank}</span>}
          {promo ? (
            <span className="ml-auto font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-clay-500 text-cream-50">
              {promo.discountType === 'percent' ? `-${promo.value}%` : `-${promo.value} TND`}
            </span>
          ) : (
            product.tag && (
              <span className="ml-auto font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-cream-50/90 text-ink-700">
                {product.tag}
              </span>
            )
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            addItem({
              ...product,
              price,
              image: product.image || getProductImage(product.id),
              meta: { type: 'product', productId: product.id, sizeMl: product.sizes[0].ml },
            })
          }}
          aria-label="Ajouter au panier"
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-cream-50 text-clay-700 shadow-card opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-1 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-clay-500 hover:text-cream-50 hover:scale-110"
        >
          <Plus size={13} className="sm:hidden" />
          <Plus size={15} className="hidden sm:block" />
        </button>
      </Link>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="font-mono text-[9px] sm:text-[10px] text-ink-400 tracking-widest">{product.sku}</p>
          {product.rating && (
            <span className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-ink-500">
              <Star size={9} className="fill-clay-500 text-clay-500" />
              {product.rating}
            </span>
          )}
        </div>
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-display text-sm sm:text-lg mb-1 text-ink-900 group-hover:text-clay-700 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="font-serif italic text-xs sm:text-sm text-ink-500 mb-2 sm:mb-4 truncate">{product.family}</p>

        <div className="mt-auto flex items-center gap-2 pt-2 sm:pt-3 border-t border-ink-900/10">
          {promo ? (
            <span className="font-mono text-[10px] sm:text-xs text-ink-300 line-through">{originalPrice} TND</span>
          ) : (
            product.oldPrice && <span className="font-mono text-[10px] sm:text-xs text-ink-300 line-through">{product.oldPrice} TND</span>
          )}
          <span className="font-mono text-sm sm:text-base text-clay-700">{price} TND</span>
        </div>
      </div>
    </div>
  )
}
