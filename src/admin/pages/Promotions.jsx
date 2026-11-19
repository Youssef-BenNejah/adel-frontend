import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X, Tag, Percent, Power } from 'lucide-react'
import {
  usePromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotion,
  describePromo,
} from '../../store/promotionsStore.js'
import { useProducts } from '../../store/productsStore.js'

const EMPTY_FORM = {
  label: '',
  code: '',
  scope: 'all',
  productIds: [],
  discountType: 'percent',
  value: '',
  active: true,
}

export default function AdminPromotions() {
  const promotions = usePromotions()
  const products = useProducts()
  const [modal, setModal] = useState(null) // null | 'new' | promo
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

  function openEdit(promo) {
    setForm({
      label: promo.label,
      code: promo.code || '',
      scope: promo.scope,
      productIds: promo.productIds,
      discountType: promo.discountType,
      value: promo.value,
      active: promo.active,
    })
    setProductQuery('')
    setModal(promo)
  }

  function submit(e) {
    e.preventDefault()
    if (modal === 'new') {
      addPromotion(form)
    } else {
      updatePromotion(modal.id, form)
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
          <h1 className="font-display text-3xl text-ink-900">Promotions ({promotions.length})</h1>
          <p className="font-sans text-sm text-ink-500 mt-1">
            Codes promo, remises automatiques globales ou ciblées sur des produits précis.
          </p>
        </div>
        <button onClick={openNew} className="btn-clay !py-2.5 shrink-0">
          <Plus size={16} /> Nouvelle promotion
        </button>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal">Promotion</th>
              <th className="px-4 py-3 font-normal">Déclenchement</th>
              <th className="px-4 py-3 font-normal">Portée</th>
              <th className="px-4 py-3 font-normal">Remise</th>
              <th className="px-4 py-3 font-normal">Statut</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => {
              const { amount, scope } = describePromo(promo)
              return (
                <tr key={promo.id} className="border-t border-ink-900/10">
                  <td className="px-4 py-3 text-ink-900">{promo.label}</td>
                  <td className="px-4 py-3">
                    {promo.code ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-sage-100 text-sage-700">
                        <Tag size={11} /> {promo.code}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-clay-50 text-clay-700">Automatique</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{scope}</td>
                  <td className="px-4 py-3 font-mono text-ink-800">{amount}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePromotion(promo.id)}
                      className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                        promo.active ? 'bg-sage-100 text-sage-700' : 'bg-ink-900/5 text-ink-400'
                      }`}
                    >
                      <Power size={11} /> {promo.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(promo)} className="text-ink-400 hover:text-clay-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setConfirmDelete(promo)} className="text-ink-400 hover:text-clay-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {promotions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-serif italic text-ink-400">
                  Aucune promotion pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-8">
          <form onSubmit={submit} className="bg-cream-50 border border-ink-900/10 rounded-3xl shadow-lift w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">{modal === 'new' ? 'Nouvelle promotion' : 'Modifier la promotion'}</h3>
              <button type="button" onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-clay-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Libellé interne">
                <input
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Ex. Black Friday, Lancement Oud Sultan..."
                  className="admin-input"
                />
              </Field>

              <Field label="Code promo (optionnel)">
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="Vide = remise automatique affichée partout"
                  className="admin-input font-mono"
                />
                <p className="font-sans text-xs text-ink-400 mt-1.5">
                  Avec un code, le client doit le saisir au panier. Sans code, la remise s'affiche directement sur le prix du
                  produit.
                </p>
              </Field>

              <Field label="Portée">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, scope: 'all' })}
                    className={`px-4 py-3 rounded-2xl border text-sm font-sans transition-colors ${
                      form.scope === 'all' ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600 hover:border-ink-900/30'
                    }`}
                  >
                    Promo globale
                    <span className="block font-mono text-[10px] text-ink-400 mt-0.5">Tous les produits</span>
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

              <div className="grid grid-cols-2 gap-4">
                <Field label="Type de remise">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, discountType: 'percent' })}
                      className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl border text-sm font-mono transition-colors ${
                        form.discountType === 'percent' ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600'
                      }`}
                    >
                      <Percent size={14} /> Pourcentage
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, discountType: 'fixed' })}
                      className={`px-3 py-3 rounded-2xl border text-sm font-mono transition-colors ${
                        form.discountType === 'fixed' ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-ink-900/15 text-ink-600'
                      }`}
                    >
                      Montant fixe
                    </button>
                  </div>
                </Field>
                <Field label={form.discountType === 'percent' ? 'Valeur (%)' : 'Valeur (TND)'}>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="admin-input"
                  />
                </Field>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-clay-500 w-3.5 h-3.5"
                />
                <span className="font-sans text-sm text-ink-700">Promotion active</span>
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
            <h3 className="font-display text-lg text-ink-900 mb-2">Supprimer « {confirmDelete.label} » ?</h3>
            <p className="font-sans text-sm text-ink-500 mb-6">Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button
                onClick={() => {
                  deletePromotion(confirmDelete.id)
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
