import { useState } from 'react'
import { X } from 'lucide-react'
import { useSettings } from '../store/settingsStore.js'

export default function AnnouncementBar() {
  const settings = useSettings()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative bg-ink-900 text-cream-50">
      <p className="section-pad py-2.5 text-center font-mono text-[11px] sm:text-xs tracking-wide pr-8">
        Livraison offerte dès <span className="font-semibold">{settings.freeShippingThreshold} TND</span> — Code :{' '}
        <span className="inline-block bg-clay-600 text-cream-50 px-2 py-0.5 rounded-full tracking-widest">
          {settings.freeShippingCode}
        </span>
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer la bannière"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-50/70 hover:text-cream-50"
      >
        <X size={14} />
      </button>
    </div>
  )
}
