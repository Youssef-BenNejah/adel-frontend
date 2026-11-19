import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

// Fetch "all" products once (boutique-scale catalog) so every page can keep
// filtering/sorting/searching client-side exactly like before.
const ALL_PAGE_SIZE = 1000

const TAG_TO_API = { Bestseller: 'Bestseller', Promo: 'Promo', Nouveau: 'Nouveau', 'Création Adel': 'CreationAdel' }
const TAG_FROM_API = { Bestseller: 'Bestseller', Promo: 'Promo', Nouveau: 'Nouveau', CreationAdel: 'Création Adel' }

export function fromApi(p) {
  return { ...p, tag: p.tag ? TAG_FROM_API[p.tag] || p.tag : null }
}

const store = createAsyncStore(async () => {
  const res = await api.get('/products', { pageSize: ALL_PAGE_SIZE })
  return res.data.map(fromApi)
})

export const useProducts = store.useStoreValue

/** True once the first fetch has resolved — lets pages distinguish "still loading" from "not found". */
export const useProductsLoaded = store.useLoaded
export const getAllProducts = store.load

export function getProductById(id) {
  return store.load().find((p) => p.id === id)
}

export function getByCategory(category) {
  return store.load().filter((p) => p.category === category)
}

export function getRelated(product, count = 4) {
  return store
    .load()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count)
}

export const MAX_PRODUCT_IMAGES = 3

export { uploadMedia as uploadProductImage } from '../api/media.js'

function toSizeRequests(sizes) {
  if (!Array.isArray(sizes)) return undefined
  return sizes.map((s) => ({ ml: Number(s.ml), price: Math.max(0, Math.round(Number(s.price) || 0)) }))
}

function toPayload(input) {
  const payload = {
    name: input.name,
    category: input.category,
    family: input.family,
    description: input.description || '',
    sizes: toSizeRequests(input.sizes),
    oldPrice: input.oldPrice ? Number(input.oldPrice) : null,
    tag: input.tag ? TAG_TO_API[input.tag] || input.tag : null,
    notesTop: input.notesTop || '',
    notesHeart: input.notesHeart || '',
    notesBase: input.notesBase || '',
  }
  if (input.mediaIds !== undefined) {
    payload.mediaIds = input.mediaIds.slice(0, MAX_PRODUCT_IMAGES)
  }
  return payload
}

export async function addProduct(input) {
  const res = await api.postAdmin('/products', toPayload(input))
  const product = fromApi(res.data)
  store.update((prev) => [product, ...prev])
  return product
}

export async function updateProduct(id, patch) {
  const res = await api.patch(`/products/${id}`, toPayload(patch))
  const product = fromApi(res.data)
  store.update((prev) => prev.map((p) => (p.id === id ? product : p)))
  return product
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
  store.update((prev) => prev.filter((p) => p.id !== id))
}
