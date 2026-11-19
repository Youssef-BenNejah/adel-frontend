import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { useProducts } from '../store/productsStore.js'
import { useCategories } from '../store/categoriesStore.js'
import { useActivePacks } from '../store/packsStore.js'
import { useHeroSlides, useCategoryTileImages, useStorefrontGalleryImages, useHomeRails } from '../store/landingStore.js'
import { getProductImage } from '../data/images.js'
import { ingredients } from '../data/fragrances.js'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'
import ImageMarquee from '../components/ImageMarquee.jsx'

const FEATURES = [
  { icon: Leaf, title: 'Matières nobles', text: 'Oud, ambre, safran — sélection rigoureuse des matières premières.' },
  { icon: ShieldCheck, title: 'Paiement à la livraison', text: 'Payez en toute confiance à la réception de votre colis.' },
  { icon: Truck, title: 'Livraison 24–48h', text: 'Expédition rapide partout en Tunisie depuis Bizerte.' },
  { icon: Sparkles, title: 'Extraits concentrés', text: 'Jusqu’à 45% de concentration pour une tenue exceptionnelle.' },
]

export default function Home() {
  const products = useProducts()
  const categories = useCategories()
  const packs = useActivePacks()
  const heroSlides = useHeroSlides()
  const categoryTileImages = useCategoryTileImages()
  const galleryImages = useStorefrontGalleryImages().map((g) => g.image)
  const { promo: promoRail, bestsellers: bestRail } = useHomeRails()

  const byCategory = useMemo(() => {
    const groups = {}
    categories.forEach((c) => (groups[c.slug] = []))
    products.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = []
      groups[p.category].push(p)
    })
    return groups
  }, [products, categories])

  return (
    <div className="overflow-x-hidden">
      {/* autoplay hero carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* floating stat strip */}
      <Reveal className="relative -mt-10 lg:-mt-14 z-30 section-pad">
        <div className="bg-cream-50/95 backdrop-blur-md border border-ink-900/10 rounded-3xl shadow-lift grid grid-cols-3 divide-x divide-ink-900/10 py-6 sm:py-8 max-w-3xl mx-auto">
          <div className="text-center px-2">
            <p className="font-display text-2xl sm:text-3xl text-clay-600">{products.length}+</p>
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-400 mt-1">Extraits</p>
          </div>
          <div className="text-center px-2">
            <p className="font-display text-2xl sm:text-3xl text-clay-600">4.9</p>
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-400 mt-1">247 avis</p>
          </div>
          <div className="text-center px-2">
            <p className="font-display text-2xl sm:text-3xl text-clay-600">4</p>
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-400 mt-1">Boutiques</p>
          </div>
        </div>
      </Reveal>

      {/* ingredient ticker */}
      <div className="relative mt-16 border-y border-ink-900/10 bg-cream-200/60 py-4 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...ingredients, ...ingredients].map((word, i) => (
            <div key={i} className="flex items-center gap-4 px-6 shrink-0">
              <span className="font-mono text-xs tracking-widest3 text-ink-500">{word}</span>
              <span className="w-1 h-1 rounded-full bg-clay-500" />
            </div>
          ))}
        </div>
      </div>

      {/* feature strip */}
      <section className="section-pad py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} className="group card-surface p-6 hover:-translate-y-1.5 hover:shadow-lift transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-clay-50 text-clay-600 flex items-center justify-center mb-4 group-hover:bg-clay-500 group-hover:text-cream-50 transition-colors duration-300">
                <f.icon size={20} strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-lg text-ink-900 mb-1.5">{f.title}</h3>
              <p className="font-sans text-sm text-ink-500 leading-relaxed">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* category strip */}
      <section className="section-pad pb-4">
        <Reveal className="grid sm:grid-cols-3 gap-5">
          {categories.map((meta, i) => (
            <Link
              key={meta.slug}
              to={`/categorie/${meta.slug}`}
              className="group relative h-[320px] overflow-hidden rounded-3xl flex flex-col justify-end p-8 shadow-card"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {(categoryTileImages[meta.slug] || byCategory[meta.slug]?.[0]) && (
                <img
                  src={categoryTileImages[meta.slug] || getProductImage(byCategory[meta.slug][0].id)}
                  alt={meta.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/25 to-transparent" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-cream-50/10 group-hover:ring-clay-400/40 transition-all duration-500" />
              <span className="relative font-mono text-[11px] uppercase tracking-widest text-clay-300 mb-2">
                {(byCategory[meta.slug] || []).length} références
              </span>
              <h3 className="relative font-display text-4xl text-cream-50">{meta.label}</h3>
              <p className="relative font-mono text-[11px] tracking-widest text-cream-100/70 mt-1 flex items-center gap-1.5">
                {meta.sub}
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </p>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* promotions horizontal rail */}
      {promoRail.length > 0 && (
        <section className="pt-20 sm:pt-28">
          <Reveal className="section-pad flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow">Offres limitées</span>
              <h2 className="heading-display text-3xl sm:text-4xl mt-2">En promotion</h2>
            </div>
            <Link to={`/categorie/${categories[0]?.slug || ''}`} className="hidden sm:flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-clay-700 link-underline">
              Tout voir <ArrowUpRight size={13} />
            </Link>
          </Reveal>
          <div className="flex gap-5 overflow-x-auto section-pad pb-4 snap-x scrollbar-thin">
            {promoRail.map((p, i) => (
              <Reveal as="div" key={p.id} delay={Math.min(i, 6) * 70} className="w-64 shrink-0 snap-start">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* bestseller horizontal rail */}
      <section className="py-20 sm:py-28">
        <Reveal className="section-pad flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Les plus demandés</span>
            <h2 className="heading-display text-3xl sm:text-4xl mt-2">Sélection du moment</h2>
          </div>
          <Link to={`/categorie/${categories[0]?.slug || ''}`} className="hidden sm:flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-clay-700 link-underline">
            Tout voir <ArrowUpRight size={13} />
          </Link>
        </Reveal>
        <div className="flex gap-5 overflow-x-auto section-pad pb-4 snap-x scrollbar-thin">
          {bestRail.map((p, i) => (
            <Reveal as="div" key={p.id} delay={Math.min(i, 6) * 70} className="w-64 shrink-0 snap-start">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* scrolling image gallery */}
      <section className="py-10 sm:py-14 space-y-4">
        <ImageMarquee images={galleryImages} />
        <ImageMarquee images={[...galleryImages].reverse()} reverse />
      </section>

      {/* pack composer teaser */}
      {packs.length > 0 && (
      <section className="section-pad py-20 sm:py-28 mt-10">
        <div className="relative grid lg:grid-cols-2 gap-10 items-center bg-cream-200/50 border border-ink-900/10 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-clay-200/40 rounded-full blur-3xl animate-float-slow" />
          <Reveal>
            <span className="eyebrow">Offre exclusive</span>
            <h2 className="heading-display text-3xl sm:text-4xl mt-2 mb-4">
              {packs.length === 1 ? packs[0].name : 'Composez votre Pack'}
            </h2>
            <p className="font-serif italic text-ink-500 text-lg mb-8">
              {packs.length === 1
                ? `Choisissez ${packs[0].size} extraits parmi ${
                    packs[0].scope === 'all' ? products.length : packs[0].productIds.length
                  } références — ${packs[0].price} TND le pack, 30ml chaque.`
                : `${packs.length} packs disponibles dès ${Math.min(...packs.map((p) => p.price))} TND.`}
            </p>
            <Link to="/packs" className="btn-clay">
              Composer mon pack
              <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal scale delay={150} className="relative grid grid-cols-3 gap-4">
            {products.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className={`aspect-[3/4] overflow-hidden rounded-2xl bg-cream-50 shadow-card ${i === 1 ? 'animate-float' : ''}`}
              >
                <img src={getProductImage(p.id)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      )}
    </div>
  )
}
