import { useMemo, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, X, Search, ImagePlus } from 'lucide-react'
import { useProducts, addProduct, updateProduct, deleteProduct, MAX_PRODUCT_IMAGES } from '../../store/productsStore.js'
import { useCategories } from '../../store/categoriesStore.js'
import { uploadMedia } from '../../api/media.js'
import { getProductImage } from '../../data/images.js'
import Pagination from '../../components/Pagination.jsx'

const TAGS = ['', 'Bestseller', 'Promo', 'Nouveau', 'Création Adel']
const PAGE_SIZE = 10

function emptyForm(defaultCategory) {
  return {
    name: '',
    category: defaultCategory || '',
    family: '',
    images: [],
    description: '',
    priceSizes: [
      { ml: 30, price: '' },
      { ml: 50, price: '' },
      { ml: 100, price: '' },
    ],
    oldPrice: '',
    tag: '',
    notesTop: '',
    notesHeart: '',
    notesBase: '',
  }
}

export default function AdminProducts() {
  const products = useProducts()
  const categories = useCategories()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [familyFilter, setFamilyFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null) // null | 'new' | product
  const [form, setForm] = useState(emptyForm())
  const [confirmDelete, setConfirmDelete] = useState(null)
  const fileRef = useRef(null)

  const familyOptions = useMemo(() => [...new Set(products.map((p) => p.family))].sort(), [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false
      if (familyFilter && p.family !== familyFilter) return false
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, query, categoryFilter, familyFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function changeFilter(setter, value) {
    setter(value)
    setPage(1)
  }

  const [imagesTouched, setImagesTouched] = useState(false)
  const [uploading, setUploading] = useState(false)

  function openNew() {
    setForm(emptyForm(categories[0]?.slug))
    setImagesTouched(false)
    setModal('new')
  }

  function openEdit(p) {
    const urls = p.images && p.images.length ? p.images : p.image ? [p.image] : []
    setForm({
      name: p.name,
      category: p.category,
      family: p.family,
      images: urls.map((url) => ({ id: null, url })),
      description: p.description || '',
      priceSizes: p.sizes.map((s) => ({ ml: s.ml, price: s.price })),
      oldPrice: p.oldPrice || '',
      tag: p.tag || '',
      notesTop: p.notes.top,
      notesHeart: p.notes.heart,
      notesBase: p.notes.base,
    })
    setImagesTouched(false)
    setModal(p)
  }

  async function handleImageFile(file) {
    if (!file) return
    setUploading(true)
    try {
      const media = await uploadMedia(file)
      setForm((f) => ({ ...f, images: [...f.images, { id: media.id, url: media.url }].slice(0, MAX_PRODUCT_IMAGES) }))
      setImagesTouched(true)
    } catch {
      // upload failed — leave the picker untouched, nothing to roll back
    } finally {
      setUploading(false)
    }
  }

  function removeImage(i) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
    setImagesTouched(true)
  }

  function updateSizePrice(i, value) {
    setForm((f) => ({ ...f, priceSizes: f.priceSizes.map((s, si) => (si === i ? { ...s, price: value } : s)) }))
  }

  function submit(e) {
    e.preventDefault()
    const payload = { ...form, sizes: form.priceSizes }
    delete payload.images
    if (imagesTouched) {
      payload.mediaIds = form.images.filter((img) => img.id).map((img) => img.id)
    }
    if (modal === 'new') {
      addProduct(payload)
    } else {
      updateProduct(modal.id, payload)
    }
    setModal(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h1 className="font-display text-3xl text-ink-900">Produits ({filtered.length})</h1>
        <button onClick={openNew} className="btn-clay !py-2.5">
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-3 border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="text-ink-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => changeFilter(setQuery, e.target.value)}
            placeholder="Rechercher un produit, une référence..."
            className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => changeFilter(setCategoryFilter, e.target.value)}
          className="border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 text-sm text-ink-700 outline-none focus:border-clay-400"
        >
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={familyFilter}
          onChange={(e) => changeFilter(setFamilyFilter, e.target.value)}
          className="border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5 text-sm text-ink-700 outline-none focus:border-clay-400"
        >
          <option value="">Toutes familles</option>
          {familyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal">Produit</th>
              <th className="px-4 py-3 font-normal">Catégorie</th>
              <th className="px-4 py-3 font-normal">Famille</th>
              <th className="px-4 py-3 font-normal">Prix</th>
              <th className="px-4 py-3 font-normal">Tag</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id} className="border-t border-ink-900/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image || getProductImage(p.id)} alt="" className="w-8 h-10 object-cover rounded-md" />
                    <div>
                      <p className="text-ink-900">{p.name}</p>
                      <p className="font-mono text-[10px] text-ink-400">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600 capitalize">{p.category}</td>
                <td className="px-4 py-3 text-ink-600">{p.family}</td>
                <td className="px-4 py-3 font-mono text-ink-800">{p.price} TND</td>
                <td className="px-4 py-3">
                  {p.tag && <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-clay-50 text-clay-700">{p.tag}</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(p)} className="text-ink-400 hover:text-clay-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(p)} className="text-ink-400 hover:text-clay-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-serif italic text-ink-400">
                  Aucun produit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      {modal && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <form onSubmit={submit} className="bg-cream-50 border border-ink-900/10 rounded-3xl shadow-lift w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">{modal === 'new' ? 'Nouveau produit' : 'Modifier le produit'}</h3>
              <button type="button" onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-clay-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field label={`Photos du produit (${form.images.length}/${MAX_PRODUCT_IMAGES})`}>
                <div className="flex items-center gap-3 flex-wrap">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-24 rounded-xl bg-cream-200 overflow-hidden shrink-0 border border-ink-900/10">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Retirer cette photo"
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-ink-900/70 text-cream-50 hover:bg-clay-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.images.length < MAX_PRODUCT_IMAGES && (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-24 rounded-xl border border-dashed border-ink-900/20 flex flex-col items-center justify-center gap-1 text-ink-400 hover:text-clay-600 hover:border-clay-400 disabled:opacity-50"
                    >
                      <ImagePlus size={18} strokeWidth={1.2} />
                      <span className="font-mono text-[10px]">{uploading ? 'Envoi…' : 'Ajouter'}</span>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e.target.files?.[0])} />
                </div>
                <p className="font-sans text-xs text-ink-400 mt-1.5">
                  Jusqu'à {MAX_PRODUCT_IMAGES} photos. Sans photo, une image du catalogue est utilisée automatiquement.
                  {modal !== 'new' && ' Changer les photos ici remplace toutes les photos existantes du produit.'}
                </p>
              </Field>

              <Field label="Nom">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Catégorie">
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
                    <option value="" disabled>
                      Choisir...
                    </option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Famille olfactive">
                  <input required value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })} className="admin-input" />
                </Field>
              </div>

              <Field label="Description complète">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le parfum, son inspiration, sa tenue..."
                  className="admin-input resize-none"
                />
              </Field>

              <Field label="Prix par contenance (TND)">
                <div className="grid grid-cols-3 gap-3">
                  {form.priceSizes.map((s, i) => (
                    <div key={s.ml}>
                      <span className="font-mono text-[10px] text-ink-400 mb-1 block">{s.ml}ml</span>
                      <input
                        required
                        type="number"
                        min="0"
                        value={s.price}
                        onChange={(e) => updateSizePrice(i, e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Tag">
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="admin-input">
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t || 'Aucun'}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Notes de tête">
                <input value={form.notesTop} onChange={(e) => setForm({ ...form, notesTop: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Notes de cœur">
                <input value={form.notesHeart} onChange={(e) => setForm({ ...form, notesHeart: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Notes de fond">
                <input value={form.notesBase} onChange={(e) => setForm({ ...form, notesBase: e.target.value })} className="admin-input" />
              </Field>
            </div>

            <div className="px-6 py-5 border-t border-ink-900/10 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button type="submit" className="btn-clay !py-2.5">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 border border-ink-900/10 rounded-3xl shadow-lift w-full max-w-sm p-6">
            <h3 className="font-display text-lg text-ink-900 mb-2">Supprimer « {confirmDelete.name} » ?</h3>
            <p className="font-sans text-sm text-ink-500 mb-6">Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteProduct(confirmDelete.id)
                  setConfirmDelete(null)
                }}
                className="font-mono text-xs uppercase tracking-widest bg-clay-600 text-cream-50 px-4 py-2.5 rounded-full"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
