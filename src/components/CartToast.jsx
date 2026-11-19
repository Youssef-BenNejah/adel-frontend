import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

export default function CartToast() {
  const { toast } = useCart()
  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-cream-50 border border-clay-400/50 px-5 py-3 flex items-center gap-3 animate-fade-up shadow-soft">
      <Check size={15} className="text-clay-600" />
      <span className="font-sans text-sm text-ink-900">{toast}</span>
    </div>
  )
}
