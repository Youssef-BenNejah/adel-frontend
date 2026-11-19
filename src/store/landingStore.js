import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'
import { fromApi } from './productsStore.js'

function sorted(list) {
  return [...list].sort((a, b) => a.order - b.order)
}

// ---------------------------------------------------------------------------
// Homepage rails (§15.3) — server-computed promo/bestseller selection, so the
// homepage doesn't need to fetch the whole catalog to run §3.7 locally.
// ---------------------------------------------------------------------------

const homeRailsStore = createAsyncStore(async () => {
  const res = await api.get('/home/rails')
  return { promo: res.data.promo.map(fromApi), bestsellers: res.data.bestsellers.map(fromApi) }
}, { promo: [], bestsellers: [] })

export function useHomeRails() {
  return homeRailsStore.useStoreValue()
}

// ---------------------------------------------------------------------------
// Hero carousel slides
// ---------------------------------------------------------------------------

const publicSlides = createAsyncStore(async () => {
  const res = await api.get('/landing/hero-slides')
  return res.data
})

const adminSlides = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/landing/hero-slides')
  return res.data
})

/** All slides (admin view), ordered. */
export function useLandingSlides() {
  return sorted(adminSlides.useStoreValue())
}

/** Only active slides, ordered — what the storefront hero carousel renders. */
export function useHeroSlides() {
  return sorted(publicSlides.useStoreValue())
}

export async function addSlide(input = {}) {
  const res = await api.postAdmin('/admin/landing/hero-slides', {
    mediaId: input.mediaId ?? null,
    eyebrow: input.eyebrow || '',
    title: input.title || '',
  })
  adminSlides.update((prev) => [...prev, res.data])
  publicSlides.refresh()
}

export async function updateSlide(id, patch) {
  const res = await api.patch(`/admin/landing/hero-slides/${id}`, patch)
  adminSlides.update((prev) => prev.map((s) => (s.id === id ? res.data : s)))
  publicSlides.refresh()
}

export async function deleteSlide(id) {
  await api.delete(`/admin/landing/hero-slides/${id}`)
  await adminSlides.refresh()
  publicSlides.refresh()
}

export async function toggleSlide(id) {
  const res = await api.patch(`/admin/landing/hero-slides/${id}/toggle`)
  adminSlides.update((prev) => prev.map((s) => (s.id === id ? res.data : s)))
  publicSlides.refresh()
}

export async function moveSlide(id, direction) {
  const res = await api.patch(`/admin/landing/hero-slides/${id}/move`, { direction })
  adminSlides.update(res.data)
  publicSlides.refresh()
}

// ---------------------------------------------------------------------------
// Category tiles — override photo for each of the 3 homepage category tiles.
// ---------------------------------------------------------------------------

const categoryTileStore = createAsyncStore(async () => {
  const res = await api.get('/landing/category-tiles')
  return res.data
}, {})

export function useCategoryTileImages() {
  return categoryTileStore.useStoreValue()
}

export async function setCategoryTileImage(slug, mediaId) {
  // PUT only echoes { categorySlug, mediaId }, not the resolved image URL — refetch for that.
  await api.put(`/admin/landing/category-tiles/${slug}`, { mediaId })
  await categoryTileStore.refresh()
}

export async function resetCategoryTileImage(slug) {
  await api.delete(`/admin/landing/category-tiles/${slug}`)
  categoryTileStore.update((prev) => ({ ...prev, [slug]: null }))
}

// ---------------------------------------------------------------------------
// Scrolling gallery strip
// ---------------------------------------------------------------------------

const publicGallery = createAsyncStore(async () => {
  const res = await api.get('/landing/gallery')
  return res.data
})

const adminGallery = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/landing/gallery')
  return res.data
})

export function useGalleryImages() {
  return sorted(adminGallery.useStoreValue())
}

export function useStorefrontGalleryImages() {
  return sorted(publicGallery.useStoreValue())
}

export async function addGalleryImage(mediaId) {
  const res = await api.postAdmin('/admin/landing/gallery', { mediaId: mediaId || null })
  adminGallery.update((prev) => [...prev, res.data])
  publicGallery.refresh()
}

export async function updateGalleryImage(id, mediaId) {
  const res = await api.patch(`/admin/landing/gallery/${id}`, { mediaId })
  adminGallery.update((prev) => prev.map((g) => (g.id === id ? res.data : g)))
  publicGallery.refresh()
}

export async function deleteGalleryImage(id) {
  await api.delete(`/admin/landing/gallery/${id}`)
  await adminGallery.refresh()
  publicGallery.refresh()
}

export async function moveGalleryImage(id, direction) {
  const res = await api.patch(`/admin/landing/gallery/${id}/move`, { direction })
  adminGallery.update(res.data)
  publicGallery.refresh()
}
