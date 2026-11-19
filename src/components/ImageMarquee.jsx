export default function ImageMarquee({ images, reverse = false, speedClass = 'animate-marquee' }) {
  const anim = reverse ? 'animate-marquee-rev' : speedClass
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 ${anim}`}>
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="w-[200px] sm:w-[260px] h-[260px] sm:h-[330px] shrink-0 rounded-3xl overflow-hidden shadow-card"
          >
            <img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}
