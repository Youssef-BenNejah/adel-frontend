// Large synthetic catalog generator — gives every listing page real breadth
// (filters, sorting, pagination) without needing a backend.

const NAME_PARTS = {
  homme: {
    a: ['Oud', 'Vétiver', 'Santal', 'Cuir', 'Ambre', 'Tabac', 'Bois', 'Safran', 'Noir', 'Musc'],
    b: ['Impérial', 'Sauvage', 'Royal', 'Intense', 'Absolu', 'Noir', 'Sultan', 'Nomade', 'Éternel', 'Précieux'],
  },
  femme: {
    a: ['Rose', 'Jasmin', 'Fleur', 'Soie', 'Iris', 'Pivoine', 'Vanille', 'Musc', 'Orchidée', 'Ambre'],
    b: ['Dorée', 'Radieuse', 'Infinie', 'Sublime', 'Tendre', 'Voilée', 'Précieuse', 'Éclatante', 'Secrète', 'Éternelle'],
  },
  unisexe: {
    a: ['Palo Santo', 'Encens', 'Cèdre', 'Ambre Gris', 'Fève Tonka', 'Poudre', 'Bois', 'Résine', 'Mousse', 'Santal'],
    b: ['Zen', 'Infini', 'Brut', 'Pur', 'Nomade', 'Suspendu', 'Minéral', 'Onirique', 'Discret', 'Absolu'],
  },
}

const FAMILIES = [
  'Oriental Boisé', 'Oriental Vanillé', 'Floral Fruité', 'Boisé Aromatique', 'Chypré Fruité',
  'Ambré Boisé', 'Floral Musqué', 'Aromatique Fougère', 'Gourmand Oriental', 'Boisé Épicé',
]

const NOTE_BANK = {
  top: ['Bergamote', 'Mandarine', 'Cardamome', 'Poire', 'Bigarade', 'Safran', 'Cannelle', 'Pamplemousse', 'Framboise', 'Poivre rose'],
  heart: ['Rose de Damas', 'Jasmin sambac', 'Iris', 'Vanille bourbon', 'Patchouli', 'Fleur d’oranger', 'Héliotrope', 'Géranium', 'Ylang-ylang', 'Pivoine'],
  base: ['Ambre gris', 'Fève tonka', 'Musc blanc', 'Bois de santal', 'Oud', 'Cèdre', 'Patchouli', 'Vanille', 'Benjoin', 'Palo santo'],
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function pick(arr, seed, salt = 0) {
  return arr[(seed + salt) % arr.length]
}

function buildProduct(category, index) {
  const parts = NAME_PARTS[category]
  const id = `${category}-${index}`
  const seed = hashString(id)
  const name = `${pick(parts.a, seed, 1)} ${pick(parts.b, seed, 7)}`
  const family = pick(FAMILIES, seed, 3)
  const basePrice = category === 'femme' ? 32 : 29
  const priceSteps = [basePrice, basePrice + 3, basePrice + 6, basePrice + 10, basePrice + 15]
  const price = pick(priceSteps, seed, 5)
  const isPromo = seed % 5 === 0
  const isBestseller = seed % 7 === 0
  const isNew = seed % 11 === 0
  const tag = isPromo ? 'Promo' : isBestseller ? 'Bestseller' : isNew ? 'Nouveau' : null
  const oldPrice = isPromo ? price + (seed % 3 === 0 ? 3 : 4) : null
  const rating = 4.4 + ((seed % 6) / 10)
  const reviews = 8 + (seed % 240)

  const prefix = category === 'homme' ? 'H' : category === 'femme' ? 'F' : 'U'
  const sku = `${prefix}${String(index + 1).padStart(3, '0')}`

  return {
    id,
    sku,
    name,
    category,
    family,
    price,
    oldPrice,
    tag,
    rating: Math.min(5, rating).toFixed(1),
    reviews,
    notes: {
      top: `${pick(NOTE_BANK.top, seed, 2)} · ${pick(NOTE_BANK.top, seed, 9)}`,
      heart: `${pick(NOTE_BANK.heart, seed, 4)} · ${pick(NOTE_BANK.heart, seed, 11)}`,
      base: `${pick(NOTE_BANK.base, seed, 6)} · ${pick(NOTE_BANK.base, seed, 13)}`,
    },
    sizes: [
      { ml: 30, price },
      { ml: 50, price: price + 10 },
      { ml: 100, price: price + 24 },
    ],
  }
}

function buildCategory(category, count) {
  return Array.from({ length: count }, (_, i) => buildProduct(category, i))
}

export const CATALOG = {
  homme: buildCategory('homme', 48),
  femme: buildCategory('femme', 48),
  unisexe: buildCategory('unisexe', 24),
}

export const ALL_PRODUCTS = [...CATALOG.homme, ...CATALOG.femme, ...CATALOG.unisexe]

export function getProductById(id) {
  return ALL_PRODUCTS.find((p) => p.id === id)
}

export function getRelated(product, count = 4) {
  return CATALOG[product.category].filter((p) => p.id !== product.id).slice(0, count)
}

export const CATEGORY_META = {
  homme: { label: 'Homme', sub: 'Boisé · Épicé · Ambré' },
  femme: { label: 'Femme', sub: 'Floral · Fruité · Musqué' },
  unisexe: { label: 'Unisexe', sub: 'Vanillé · Minéral · Doux' },
}
