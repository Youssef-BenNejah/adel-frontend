import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useCategories, addCategory, updateCategory, deleteCategory } from '../../store/categoriesStore.js'
import { useProducts } from '../../store/productsStore.js'

const EMPTY_FORM = { label: '', sub: '' }

export default function AdminCategories() {
  const categories = useCategories()
  const products = useProducts()
  const [modal, setModal] = useState(null) // null | 'new' | category
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function countFor(slug) {
    return products.filter((p) => p.category === slug).length
  }

  function openNew() {
    setForm(EMPTY_FORM)
    setModal('new')
  }

  function openEdit(cat) {
    setForm({ label: cat.label, sub: cat.sub })
    setModal(cat)
  }

  function submit(e) {
    e.preventDefault()
    if (modal === 'new') {
      addCategory(form)
    } else {
      updateCategory(modal.slug, form)
    }
    setModal(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Catégories ({categories.length})</h1>
          <p className="font-sans text-sm text-ink-500 mt-1">
            Les rayons de la boutique — affichés dans le menu, la page d'accueil et les filtres produit.
          </p>
        </div>
        <button onClick={openNew} className="btn-clay !py-2.5 shrink-0">
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3 font-normal">Catégorie</th>
              <th className="px-4 py-3 font-normal">Sous-titre</th>
              <th className="px-4 py-3 font-normal">URL</th>
              <th className="px-4 py-3 font-normal">Produits</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug} className="border-t border-ink-900/10">
                <td className="px-4 py-3 text-ink-900">{cat.label}</td>
                <td className="px-4 py-3 text-ink-600">{cat.sub || '—'}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-ink-400">/categorie/{cat.slug}</td>
                <td className="px-4 py-3 font-mono text-ink-800">{countFor(cat.slug)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(cat)} className="text-ink-400 hover:text-clay-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(cat)} className="text-ink-400 hover:text-clay-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-serif italic text-ink-400">
                  Aucune catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[90] bg-ink-900/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-8">
          <form onSubmit={submit} className="bg-cream-50 border border-ink-900/10 rounded-3xl shadow-lift w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
              <h3 className="font-display text-xl text-ink-900">{modal === 'new' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}</h3>
              <button type="button" onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-clay-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Nom</span>
                <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ex. Homme, Enfant, Édition limitée..." className="admin-input" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Sous-titre</span>
                <input value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })} placeholder="Ex. Boisé · Épicé · Ambré" className="admin-input" />
              </label>
              {modal !== 'new' && (
                <p className="font-mono text-[11px] text-ink-400">URL : /categorie/{modal.slug}</p>
              )}
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
            <p className="font-sans text-sm text-ink-500 mb-6">
              {countFor(confirmDelete.slug) > 0
                ? `${countFor(confirmDelete.slug)} produit(s) resteront dans le catalogue mais ne seront plus accessibles depuis le menu.`
                : 'Cette action est irréversible.'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="font-mono text-xs uppercase tracking-widest text-ink-500 px-4 py-2.5">
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteCategory(confirmDelete.slug)
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
