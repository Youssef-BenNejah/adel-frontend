// Real, unbranded photography sourced from Unsplash (free license) for the Adel Fragrances UI.
// Helper builds a right-sized, cropped URL from a base Unsplash photo id.

function unsplash(id, { w = 1200, h, fit = 'crop', q = 80 } = {}) {
  const params = new URLSearchParams({ auto: 'format', fit, q, w })
  if (h) params.set('h', h)
  return `https://images.unsplash.com/${id}?${params.toString()}`
}

const BOTTLE_MARBLE = 'photo-1594125311687-3b1b3eafa9f4' // clear bottle, black cap, on marble among plants
const DECANTERS = 'photo-1535683577427-740aaac4ec25' // crystal decanters, warm amber light
const BOTTLE_GROUP = 'photo-1718466044521-d38654f3ba0a' // group of amber/clear bottles, dramatic shadow
const ROSE_PETALS = 'photo-1762328872690-83c41dd9cae1' // close-up vivid rose petals

// Dramatic hero carousel — rotating full-bleed lifestyle / bottle photography
export const heroSlides = [
  {
    image: unsplash(BOTTLE_GROUP, { w: 1600, h: 2000 }),
    eyebrow: 'Collection Signature',
    title: "L'art olfactif,\nsans compromis.",
  },
  {
    image: unsplash(DECANTERS, { w: 1600, h: 2000 }),
    eyebrow: 'Oud & Bois précieux',
    title: 'Des matières rares,\ncomposées à Bizerte.',
  },
  {
    image: unsplash(BOTTLE_MARBLE, { w: 1600, h: 2000 }),
    eyebrow: 'Rituel olfactif',
    title: 'Chaque flacon,\nune signature.',
  },
]

export const heroImage = heroSlides[0].image

// Rotating pool of product bottle photography for cards / cart / pack builder
export const productImages = [
  unsplash(BOTTLE_MARBLE, { w: 700, h: 900 }),
  unsplash(DECANTERS, { w: 700, h: 900 }),
  unsplash(BOTTLE_GROUP, { w: 700, h: 900 }),
  unsplash(BOTTLE_MARBLE, { w: 700, h: 900, q: 70 }),
  unsplash(DECANTERS, { w: 700, h: 900, q: 70 }),
  unsplash(BOTTLE_GROUP, { w: 700, h: 900, q: 70 }),
]

// Macro floral / ingredient photography
export const floralImage = unsplash(ROSE_PETALS, { w: 1200, h: 1400 })

// Heritage / apothecary craft photography
export const craftImage = unsplash(DECANTERS, { w: 1200, h: 1400 })

// Soft, airy lifestyle shot (light background) — used in brand story / texture sections
export const textureImage = unsplash(BOTTLE_MARBLE, { w: 1600, h: 1000 })

// Horizontal scrolling gallery strip — mixed lifestyle, ingredient & bottle shots
export const galleryStrip = [
  unsplash(BOTTLE_GROUP, { w: 900, h: 1100 }),
  unsplash(ROSE_PETALS, { w: 900, h: 1100 }),
  unsplash(DECANTERS, { w: 900, h: 1100 }),
  unsplash(BOTTLE_MARBLE, { w: 900, h: 1100 }),
  unsplash(ROSE_PETALS, { w: 900, h: 1100, q: 70 }),
  unsplash(BOTTLE_GROUP, { w: 900, h: 1100, q: 70 }),
  unsplash(BOTTLE_MARBLE, { w: 900, h: 1100, q: 70 }),
  unsplash(DECANTERS, { w: 900, h: 1100, q: 70 }),
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function getProductImage(id) {
  return productImages[hashString(id) % productImages.length]
}
