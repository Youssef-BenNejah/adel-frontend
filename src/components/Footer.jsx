import { Instagram, Facebook, Music2 } from 'lucide-react'

const COLS = [
  {
    title: 'Client Care',
    links: ['Journal des senteurs', 'Notre histoire', 'Nous contacter', 'Livraison & retours', 'Conditions générales'],
  },
  {
    title: 'Maison Adel',
    links: ['Bizerte · 3rd arr.', 'Ariana', 'Manouba', 'Oued Ellil'],
  },
]

export default function Footer() {
  return (
    <footer className="section-pad pt-16 pb-10 border-t border-ink-900/10 bg-cream-50 rounded-t-[2.5rem]">
      <div className="grid sm:grid-cols-3 gap-10 mb-14">
        <div>
          <img src="/brand/logo-full-color.png" alt="Adel Fragrances" className="h-24 w-auto mb-6 -ml-1" />
          <div className="flex gap-3 text-ink-500">
            <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-900/10 hover:border-clay-400 hover:text-clay-600 hover:-translate-y-0.5 transition-all duration-300">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-900/10 hover:border-clay-400 hover:text-clay-600 hover:-translate-y-0.5 transition-all duration-300">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-900/10 hover:border-clay-400 hover:text-clay-600 hover:-translate-y-0.5 transition-all duration-300">
              <Music2 size={16} />
            </a>
          </div>
        </div>

        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink-400 mb-4">{c.title}</h4>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="font-sans text-sm text-ink-600 hover:text-clay-600 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-ink-900/10 font-mono text-[11px] text-ink-400">
        <span>© 2026 Adel Fragrances · Tunisie · Tous droits réservés</span>
        <span>Fait avec soin à Bizerte</span>
      </div>
    </footer>
  )
}
