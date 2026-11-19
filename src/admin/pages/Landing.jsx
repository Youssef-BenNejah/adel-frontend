import { useRef } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, ImagePlus, Eye, EyeOff, RotateCcw } from 'lucide-react'
import {
  useLandingSlides,
  addSlide,
  updateSlide,
  deleteSlide,
  toggleSlide,
  moveSlide,
  useCategoryTileImages,
  setCategoryTileImage,
  resetCategoryTileImage,
  useGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  moveGalleryImage,
} from '../../store/landingStore.js'
import { useCategories } from '../../store/categoriesStore.js'
import { uploadMedia } from '../../api/media.js'

async function uploadAndApply(file, cb) {
  if (!file) return
  const media = await uploadMedia(file)
  cb(media.id)
}

export default function AdminLanding() {
  const slides = useLandingSlides()
  const categoryTileImages = useCategoryTileImages()
  const galleryImages = useGalleryImages()
  const categories = useCategories()

  return (
    <div className="space-y-14">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Page d'accueil</h1>
        <p className="font-sans text-sm text-ink-500 mt-1 max-w-2xl">
          Toutes les images visibles par les clients sur la page d'accueil, organisées section par section — chaque bloc
          vous dit exactement où il apparaît sur le site.
        </p>
      </div>

      {/* ---------------- Hero carousel ---------------- */}
      <SectionBlock
        title="1. Bannière principale (carrousel)"
        description="Les diapositives plein écran, tout en haut de la page d'accueil, qui défilent automatiquement."
        action={
          <button onClick={() => addSlide({})} className="btn-clay !py-2.5 shrink-0">
            <Plus size={16} /> Ajouter une diapositive
          </button>
        }
      >
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {slides.map((slide, i) => (
            <HeroSlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              onFile={(file) => uploadAndApply(file, (mediaId) => updateSlide(slide.id, { mediaId }))}
              onChange={(patch) => updateSlide(slide.id, patch)}
              onDelete={() => deleteSlide(slide.id)}
              onToggle={() => toggleSlide(slide.id)}
              onMove={(dir) => moveSlide(slide.id, dir)}
            />
          ))}
          {slides.length === 0 && (
            <div className="col-span-full border border-dashed border-ink-900/20 rounded-3xl py-16 text-center font-serif italic text-ink-400">
              Aucune diapositive — ajoutez-en une pour composer le carrousel.
            </div>
          )}
        </div>
      </SectionBlock>

      {/* ---------------- Category tiles ---------------- */}
      <SectionBlock
        title="2. Vignettes de catégories"
        description="Les 3 grandes cases juste en dessous de la bannière, qui renvoient vers Homme, Femme et Unisexe."
      >
        <div className="grid sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryTileCard
              key={cat.slug}
              slug={cat.slug}
              label={cat.label}
              image={categoryTileImages[cat.slug]}
              isCustom={Boolean(categoryTileImages[cat.slug])}
              onFile={(file) => uploadAndApply(file, (mediaId) => setCategoryTileImage(cat.slug, mediaId))}
              onReset={() => resetCategoryTileImage(cat.slug)}
            />
          ))}
          {categories.length === 0 && (
            <p className="col-span-full font-serif italic text-ink-400 py-8 text-center">Aucune catégorie — créez-en depuis l'onglet Catégories.</p>
          )}
        </div>
      </SectionBlock>

      {/* ---------------- Gallery marquee ---------------- */}
      <SectionBlock
        title="3. Galerie défilante"
        description="Les deux bandes d'images qui défilent horizontalement en bas de la page d'accueil, entre la sélection du moment et le composeur de pack."
        action={
          <button onClick={() => addGalleryImage(null)} className="btn-clay !py-2.5 shrink-0">
            <Plus size={16} /> Ajouter une image
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
          {galleryImages.map((g, i) => (
            <GalleryImageCard
              key={g.id}
              image={g.image}
              index={i}
              total={galleryImages.length}
              onFile={(file) => uploadAndApply(file, (mediaId) => updateGalleryImage(g.id, mediaId))}
              onDelete={() => deleteGalleryImage(g.id)}
              onMove={(dir) => moveGalleryImage(g.id, dir)}
            />
          ))}
          {galleryImages.length === 0 && (
            <div className="col-span-full border border-dashed border-ink-900/20 rounded-3xl py-16 text-center font-serif italic text-ink-400">
              Aucune image — ajoutez-en une pour composer la galerie.
            </div>
          )}
        </div>
      </SectionBlock>
    </div>
  )
}

function SectionBlock({ title, description, action, children }) {
  return (
    <section>
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="font-display text-xl text-ink-900">{title}</h2>
          <p className="font-sans text-sm text-ink-500 mt-1 max-w-xl">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function HeroSlideCard({ slide, index, total, onFile, onChange, onDelete, onToggle, onMove }) {
  const fileRef = useRef(null)

  return (
    <div
      className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${
        slide.active ? 'border-ink-900/10 bg-cream-50 shadow-card' : 'border-dashed border-ink-900/20 bg-cream-100 opacity-60'
      }`}
    >
      <div className="relative h-40 bg-cream-200 group">
        {slide.image ? (
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-300">
            <ImagePlus size={28} strokeWidth={1.2} />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/0 group-hover:bg-ink-900/40 text-cream-50 opacity-0 group-hover:opacity-100 transition-all duration-300 font-mono text-[11px] uppercase tracking-widest"
        >
          Changer l'image
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <span className="absolute top-2.5 left-2.5 font-mono text-[10px] bg-cream-50/90 text-clay-700 px-2 py-0.5 rounded-full">
          Diapo {String(index + 1).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-cream-50/90 text-ink-700 hover:text-clay-600"
          aria-label={slide.active ? 'Désactiver' : 'Activer'}
        >
          {slide.active ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
      </div>

      <div className="p-4 space-y-2.5">
        <input
          value={slide.eyebrow}
          onChange={(e) => onChange({ eyebrow: e.target.value })}
          placeholder="Eyebrow — ex. Collection Signature"
          className="w-full font-mono text-[11px] uppercase tracking-widest text-clay-600 bg-transparent outline-none placeholder:text-ink-300 border-b border-ink-900/10 pb-1.5"
        />
        <textarea
          value={slide.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={"Titre — ex. \"L'art olfactif,\nsans compromis.\""}
          rows={2}
          className="w-full font-display text-base text-ink-900 bg-transparent outline-none placeholder:text-ink-300 placeholder:font-sans placeholder:text-sm resize-none"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-ink-900/10">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-ink-400 hover:text-clay-600 hover:bg-cream-200 disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Monter"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-ink-400 hover:text-clay-600 hover:bg-cream-200 disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Descendre"
          >
            <ArrowDown size={14} />
          </button>
        </div>
        <button type="button" onClick={onDelete} className="text-ink-400 hover:text-clay-600">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

function CategoryTileCard({ slug, label, image, isCustom, onFile, onReset }) {
  const fileRef = useRef(null)

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-cream-50 shadow-card overflow-hidden">
      <div className="relative h-40 bg-cream-200 group">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-300">
            <ImagePlus size={28} strokeWidth={1.2} />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/0 group-hover:bg-ink-900/40 text-cream-50 opacity-0 group-hover:opacity-100 transition-all duration-300 font-mono text-[11px] uppercase tracking-widest"
        >
          Changer l'image
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        {!isCustom && (
          <span className="absolute top-2.5 left-2.5 font-mono text-[10px] bg-cream-50/90 text-ink-500 px-2 py-0.5 rounded-full">
            Photo produit par défaut
          </span>
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-ink-900">{label}</p>
          <p className="font-mono text-[10px] text-ink-400">/categorie/{slug}</p>
        </div>
        {isCustom && (
          <button type="button" onClick={onReset} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-400 hover:text-clay-600 hover:bg-cream-200" aria-label="Réinitialiser">
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

function GalleryImageCard({ image, index, total, onFile, onDelete, onMove }) {
  const fileRef = useRef(null)

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 shadow-card overflow-hidden">
      <div className="relative aspect-[3/4] bg-cream-200 group">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-300">
            <ImagePlus size={22} strokeWidth={1.2} />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-ink-900/0 group-hover:bg-ink-900/40 text-cream-50 opacity-0 group-hover:opacity-100 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest text-center px-2"
        >
          Changer
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <span className="absolute top-2 left-2 font-mono text-[9px] bg-cream-50/90 text-clay-700 px-1.5 py-0.5 rounded-full">
          {index + 1}
        </span>
      </div>
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-ink-400 hover:text-clay-600 hover:bg-cream-200 disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Monter"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-ink-400 hover:text-clay-600 hover:bg-cream-200 disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Descendre"
          >
            <ArrowDown size={12} />
          </button>
        </div>
        <button type="button" onClick={onDelete} className="w-6 h-6 flex items-center justify-center text-ink-400 hover:text-clay-600">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
