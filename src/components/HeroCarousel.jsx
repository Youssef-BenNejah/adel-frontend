import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroCarousel({ slides, interval = 5000 }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, interval)
    return () => clearInterval(timerRef.current)
  }, [paused, slides.length, interval])

  function go(i) {
    setActive((i + slides.length) % slides.length)
  }

  return (
    <div
      className="relative h-[72vh] lg:h-[88vh] overflow-hidden rounded-b-[2.5rem] lg:rounded-[2.5rem] lg:mx-6 lg:mt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-silk ${
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover ${i === active ? 'animate-kenburns' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-ink-900/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/50 via-transparent to-transparent" />

          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-16 pb-20 sm:pb-24 lg:pb-0 max-w-2xl">
            <span
              className={`eyebrow !text-gold-300 mb-4 inline-block transition-all duration-700 delay-150 ${
                i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {slide.eyebrow}
            </span>
            <h1
              className={`font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-cream-50 whitespace-pre-line transition-all duration-700 delay-300 ${
                i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {slide.title}
            </h1>
            <div
              className={`flex flex-wrap items-center gap-4 mt-8 transition-all duration-700 delay-[450ms] ${
                i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link to="/" className="btn-clay group">
                Explorer la collection
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/packs" className="inline-flex items-center justify-center gap-2 border border-cream-50/40 text-cream-50 px-7 py-3.5 rounded-full font-sans text-sm tracking-[0.1em] uppercase font-medium backdrop-blur-sm transition-all duration-300 hover:bg-cream-50/15 hover:-translate-y-0.5">
                Composer un pack
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Précédent"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur-sm hover:bg-cream-50/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Suivant"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur-sm hover:bg-cream-50/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* dots */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Diapositive ${i + 1}`}
            className={`dot-indicator ${i === active ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
