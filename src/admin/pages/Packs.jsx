import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X, Power } from 'lucide-react'
import { usePacks, addPack, updatePack, deletePack, togglePack } from '../../store/packsStore.js'
import { useProducts } from '../../store/productsStore.js'

const EMPTY_FORM = { name: '', price: '', size: 3, scope: 'all', productIds: [], active: true }

export default function AdminPacks() {
  const packs = usePacks()
  const products = useProducts()
  const [modal, setModal] = useState(null) // null | 'new' | pack
  const [form, setForm] = useState(EMPTY_FORM)
  const [productQuery, setProductQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }, [products, productQuery])

  function openNew() {
    setForm(EMPTY_FORM)
    setProductQuery('')
    setModal('new')
  }

  function openEdit(pack) {
    setForm({
      name: pack.name,
      price: pack.price,
      size: pack.size,
      scope: pack.scope,
      productIds: pack.productIds,
      active: pack.active,
    })
    setProductQuery('')
    setModal(pack)
  }

  function submit(e) {
    e.preventDefault()
    if (modal === 'new') {
      addPack(form)
    } else {
      updatePack(modal.id, form)
    }
    setModal(null)
  }

  function toggleProduct(id) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter((x) => x !== id) : [...f.productIds, id],
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Packs ({packs.length})</h1>
          <p className="font-sans text-sm text-ink-500 mt-1">
            Les packs que les clients composent eux-mêmes — nom, prix et produits éligibles pour chacun.
          </p>
        </div>
        <button onClick={openNew} className="btn-clay !py-2.5 shrink-0">
          <Plus size={16} /> Nouveau pack
        </button>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal">Pack</th>
              <th className="px-4 py-3 font-normal">Taille</th>
              <th className="px-4 py-3 font-normal">Prix</th>
              <th className="px-4 py-3 font-normal">Produits éligibles</th>
              <th className="px-4 py-3 font-normal">Statut</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {packs.map((pack) => (
              <tr key={pack.id} className="border-t border-ink-900/10">
                <td className="px-4 py-3 text-ink-900">{pack.name}</td>
                <td className="px-4 py-3 font-mono text-ink-600">{pack.size} extraits</td>
                <td className="px-4 py-3 font-mono text-ink-800">{pack.price} TND</td>
                <td className="px-4 py-3 text-ink-600">{pack.scope === 'all' ? 'Toute la collection' : `${pack.productIds.length} produit(s)`}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePack(pack.id)}
                    className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                      pack.active ? 'bg-sage-100 text-sage-700' : 'bg-ink-900/5 text-ink-400'
                    }`}
                  >
                    <Power size={11} /> {pack.active ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(pack)} className="text-ink-400 hover:text-clay-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(pack)} className="text-ink-400 hover:text-clay-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-serif italic text-ink-400">
                  Aucun pack pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <form onSubmit={submit} className="bg-cream-50 border border-ink-900/10 rounded-3xl shadow-lift w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">{modal === 'new' ? 'Nouveau pack' : 'Modifier le pack'}</h3>
              <button type="button" onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-clay-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Nom du pack">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex. Pack Découverte, Pack Homme Signature..."
                  className="admin-input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Prix du pack (TND)">
                  <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" />
                </Field>
                <Field label="Extraits à choisir">
                  <input required type="number" min="1" max="10" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="admin-input" />
                </Field>
              </div>

              <Field label="Produits éligibles">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, scope: 'all' })}
                    className={`px-4 py-3 rounded-2xl border text-sm font-sans transition-colors ${
                      form.scope === 'all' ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600 hover:border-ink-900/30'
                    }`}
                  >
                    Toute la collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, scope: 'products' })}
                    className={`px-4 py-3 rounded-2xl border text-sm font-sans transition-colors ${
                      form.scope === 'products' ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600 hover:border-ink-900/30'
                    }`}
                  >
                    Produits choisis
                    <span className="block font-mono text-[10px] text-ink-400 mt-0.5">{form.productIds.length} sélectionné(s)</span>
                  </button>
                </div>
              </Field>

              {form.scope === 'products' && (
                <div className="border border-ink-900/15 rounded-2xl overflow-hidden">
                  <div className="p-3 border-b border-ink-900/10">
                    <input
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      placeholder="Rechercher un produit..."
                      className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-ink-900/5">
                    {filteredProducts.map((p) => (
                      <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-200/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.productIds.includes(p.id)}
                          onChange={() => toggleProduct(p.id)}
                          className="accent-clay-500 w-3.5 h-3.5 shrink-0"
                        />
                        <span className="flex-1 text-sm text-ink-900 truncate">{p.name}</span>
                        <span className="font-mono text-[10px] text-ink-400 shrink-0">{p.sku}</span>
                      </label>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="px-4 py-6 text-center font-serif italic text-ink-400 text-sm">Aucun produit.</p>
                    )}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-clay-500 w-3.5 h-3.5"
                />
                <span className="font-sans text-sm text-ink-700">Pack actif (visible sur la boutique)</span>
              </label>
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
                  deletePack(confirmDelete.id)
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
