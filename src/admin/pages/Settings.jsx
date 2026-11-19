import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useSettings, updateSettings } from '../../store/settingsStore.js'

export default function AdminSettings() {
  const settings = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => setForm(settings), [settings])

  function submit(e) {
    e.preventDefault()
    updateSettings({
      ...form,
      freeShippingThreshold: Number(form.freeShippingThreshold),
      shippingFee: Number(form.shippingFee),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl text-ink-900 mb-8">Paramètres de la boutique</h1>

      <form onSubmit={submit} className="card-surface p-6 space-y-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Nom de la boutique</span>
          <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="admin-input" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Livraison gratuite dès (TND)</span>
            <input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })} className="admin-input" />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Frais de livraison (TND)</span>
            <input type="number" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: e.target.value })} className="admin-input" />
          </label>
        </div>

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-1.5 block">Code promo affiché dans la bannière</span>
          <input value={form.freeShippingCode} onChange={(e) => setForm({ ...form, freeShippingCode: e.target.value.toUpperCase() })} className="admin-input" />
        </label>

        <p className="font-sans text-xs text-ink-400">
          La gestion des packs (nom, prix, produits éligibles) se fait désormais depuis l'onglet « Packs ».
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="btn-clay !py-2.5">
            Enregistrer
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-sage-600">
              <Check size={14} /> Enregistré
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
