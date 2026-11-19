import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { quoteCart, validatePromoCode } from '../api/cart.js'
import { placeOrder as submitOrder } from '../store/ordersStore.js'
import { ApiError } from '../api/client.js'
import { getProductImage } from '../data/images.js'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo] = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', street: '', city: '', note: '' })
  const [placedOrder, setPlacedOrder] = useState(null)
  const [quote, setQuote] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // The server owns all pricing — subtotal, promo discount, shipping, total
  // (backend-api-spec.md §10) — re-quoted whenever the cart or code changes.
  useEffect(() => {
    if (items.length === 0) {
      setQuote(null)
      return
    }
    let cancelled = false
    quoteCart(items, appliedCode)
      .then((data) => {
        if (!cancelled) setQuote(data)
      })
      .catch(() => {
        if (!cancelled) setQuote(null)
      })
    return () => {
      cancelled = true
    }
  }, [items, appliedCode])

  const subtotal = quote?.subtotal ?? items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = quote?.discount ?? 0
  const shipping = quote?.shipping ?? 0
  const grandTotal = quote?.total ?? subtotal

  async function applyPromo(e) {
    e.preventDefault()
    if (!quote) return
    try {
      const res = await validatePromoCode(promo, quote.lines)
      if (!res.promo) {
        setPromoError(
          res.reason === 'NO_MATCHING_ITEMS' ? "Ce code ne s'applique à aucun article de votre panier." : 'Code invalide ou expiré.'
        )
        setAppliedCode(null)
        return
      }
      setPromoError('')
      setAppliedCode(res.promo.code)
    } catch {
      setPromoError('Code invalide ou expiré.')
      setAppliedCode(null)
    }
  }

  async function placeOrder(e) {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const order = await submitOrder({
        items,
        promoCode: appliedCode,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          street: form.street,
          city: form.city,
          note: form.note,
        },
      })
      setPlacedOrder(order)
      clearCart()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (placedOrder) {
    return (
      <div className="section-pad py-28 flex flex-col items-center text-center gap-5">
        <CheckCircle2 size={48} className="text-sage-600" strokeWidth={1} />
        <h1 className="heading-display text-3xl">Commande confirmée</h1>
        <p className="font-serif italic text-ink-500">
          Référence <span className="font-mono not-italic text-clay-700">{placedOrder.id}</span> — paiement à la livraison, livraison sous 24–48h.
        </p>
        <Link to="/" className="btn-clay mt-4">
          Retour à l'accueil
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="section-pad py-28 flex flex-col items-center text-center gap-5">
        <ShoppingBag size={44} className="text-ink-200" strokeWidth={1} />
        <h1 className="heading-display text-3xl">Votre panier est vide</h1>
        <p className="font-serif italic text-ink-500">L'aventure olfactive commence ici.</p>
        <Link to="/" className="btn-clay mt-4">
          Découvrir la collection
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="section-pad py-10 sm:py-14 max-w-3xl mx-auto">
      <h1 className="heading-display text-4xl sm:text-5xl mb-8">Validation de la commande</h1>

      {/* cart line items — quantities editable before checkout */}
      <div className="divide-y divide-ink-900/10 mb-6">
        {items.map((item, i) => {
          const line = quote?.lines?.[i]
          const lineTotal = line?.lineTotal ?? item.price * item.qty
          return (
            <div key={item.id} className="flex gap-5 py-5">
              <div className="w-16 h-20 bg-cream-200 overflow-hidden shrink-0 rounded-2xl">
                <img src={item.image || getProductImage(item.id)} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-clay-600 tracking-widest">{item.sku}</p>
                <p className="font-display text-base text-ink-900 truncate">{item.name}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-ink-900/15 rounded-full overflow-hidden">
                    <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 hover:text-clay-600">
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center font-mono text-sm">{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:text-clay-600">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center rounded-full text-ink-300 hover:text-clay-600 hover:bg-clay-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <span className="font-mono text-sm text-ink-900 shrink-0">{lineTotal} TND</span>
            </div>
          )
        })}
      </div>

      {/* promo code toggle */}
      <div className="bg-clay-50/60 border border-clay-200/60 rounded-2xl px-4 py-3 mb-8">
        {!promoOpen ? (
          <button type="button" onClick={() => setPromoOpen(true)} className="font-sans text-sm text-ink-700">
            Avez-vous un code promo ? <span className="text-clay-700 underline underline-offset-2">Cliquez ici pour saisir votre code</span>
          </button>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 border border-ink-900/15 bg-cream-50 rounded-full px-4 py-2.5">
                <Tag size={14} className="text-clay-600" />
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Code promo"
                  className="w-full bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
                />
              </div>
              <button type="button" onClick={applyPromo} className="font-mono text-xs uppercase tracking-widest border border-ink-900/15 rounded-full px-4 py-2.5 hover:border-clay-400 bg-cream-50">
                OK
              </button>
            </div>
            {appliedCode && quote?.appliedPromo && (
              <p className="font-mono text-xs text-sage-600 mt-2">
                Code {quote.appliedPromo.code} appliqué (-{quote.appliedPromo.discount} TND)
              </p>
            )}
            {promoError && <p className="font-mono text-xs text-clay-700 mt-2">{promoError}</p>}
          </div>
        )}
      </div>

      <form onSubmit={placeOrder}>
        <div className="grid sm:grid-cols-2 gap-10 mb-10">
          <div>
            <h2 className="font-display text-xl text-ink-900 mb-5">Facturation &amp; Expédition</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Prénom" required>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="checkout-input"
                />
              </Field>
              <Field label="Nom" required>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="checkout-input"
                />
              </Field>
            </div>

            <Field label="Pays/région" required className="mb-3">
              <div className="checkout-input bg-cream-200/60 text-ink-700 cursor-not-allowed select-none flex items-center justify-between">
                Tunisie
                <ChevronDown size={14} className="text-ink-400" />
              </div>
            </Field>

            <Field label="Numéro et nom de rue" required className="mb-3">
              <input
                required
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="Numéro de voie et nom de la rue"
                className="checkout-input"
              />
            </Field>

            <Field label="Ville" required className="mb-3">
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="checkout-input"
              />
            </Field>

            <Field label="Téléphone" required className="mb-3">
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="checkout-input"
              />
            </Field>

            <Field label="Adresse e-mail (facultatif)">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="checkout-input"
              />
            </Field>
          </div>

          <div>
            <h2 className="font-display text-xl text-ink-900 mb-5">Informations complémentaires</h2>
            <Field label="Notes de commande (facultatif)">
              <textarea
                rows={6}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Commentaires concernant votre commande, ex. : consignes de livraison."
                className="checkout-input resize-none"
              />
            </Field>
          </div>
        </div>

        <h2 className="font-display text-xl text-ink-900 mb-4">Votre commande</h2>
        <div className="border border-ink-900/10 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 bg-cream-200/40">
                <th className="text-left font-mono text-[11px] uppercase tracking-widest text-ink-500 px-4 py-3 font-normal">Produit</th>
                <th className="text-right font-mono text-[11px] uppercase tracking-widest text-ink-500 px-4 py-3 font-normal">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const line = quote?.lines?.[i]
                const lineTotal = line?.lineTotal ?? item.price * item.qty
                return (
                  <tr key={item.id} className="border-b border-ink-900/10">
                    <td className="px-4 py-3 text-ink-700">
                      {item.name} <span className="text-ink-400">× {item.qty}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-ink-800">{lineTotal} TND</td>
                  </tr>
                )
              })}
              <tr className="border-b border-ink-900/10">
                <td className="px-4 py-3 text-ink-700 font-medium">Sous-total</td>
                <td className="px-4 py-3 text-right font-mono text-ink-800">{subtotal} TND</td>
              </tr>
              {discount > 0 && (
                <tr className="border-b border-ink-900/10">
                  <td className="px-4 py-3 text-sage-600 font-medium">Réduction</td>
                  <td className="px-4 py-3 text-right font-mono text-sage-600">-{discount} TND</td>
                </tr>
              )}
              <tr className="border-b border-ink-900/10">
                <td className="px-4 py-3 text-ink-700 font-medium">Expédition</td>
                <td className="px-4 py-3 text-right font-mono text-ink-800">
                  {shipping === 0 ? 'Livraison offerte' : `Livraison à domicile : ${shipping} TND`}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-ink-900 font-display text-base">Total</td>
                <td className="px-4 py-3 text-right font-display text-base text-clay-700">{grandTotal} TND</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <div className="border border-ink-900/15 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-cream-200/50 font-sans text-sm text-ink-900 flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-clay-600 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-clay-600" />
              </span>
              Paiement à la livraison
            </div>
            <p className="px-4 py-3 text-sm text-ink-500 bg-cream-50">Payer en argent comptant à la livraison.</p>
          </div>
        </div>

        {submitError && <p className="font-mono text-xs text-clay-700 bg-clay-50 border border-clay-200 rounded-xl px-3 py-2 mb-4">{submitError}</p>}
        <button type="submit" disabled={submitting} className="btn-clay w-full !bg-clay-700 hover:!bg-clay-800 disabled:opacity-50">
          {submitting ? 'ENVOI EN COURS…' : 'COMMANDER'}
        </button>
        <p className="font-mono text-[10px] text-ink-400 text-center mt-4">Paiement à la livraison · Livraison 24–48h</p>
      </form>
    </div>
  )
}

function Field({ label, required, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-sm text-ink-800 mb-1.5 block">
        {label} {required && <span className="text-clay-600">*</span>}
      </span>
      {children}
    </label>
  )
}
