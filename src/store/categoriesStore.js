import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

const store = createAsyncStore(async () => {
  const res = await api.get('/categories')
  return res.data
})

function sorted(list) {
  return [...list].sort((a, b) => a.order - b.order)
}

export function useCategories() {
  return sorted(store.useStoreValue())
}

/** True once the first fetch has resolved — lets pages distinguish "still loading" from "not found". */
export const useCategoriesLoaded = store.useLoaded

export function getCategories() {
  return sorted(store.load())
}

export function getCategoryBySlug(slug) {
  return store.load().find((c) => c.slug === slug)
}

export async function addCategory({ label, sub }) {
  const res = await api.postAdmin('/categories', { label, sub })
  store.update((prev) => [...prev, res.data])
  return res.data.slug
}

export async function updateCategory(slug, patch) {
  const res = await api.patch(`/categories/${slug}`, patch)
  store.update((prev) => prev.map((c) => (c.slug === slug ? res.data : c)))
}

export async function deleteCategory(slug) {
  await api.delete(`/categories/${slug}`)
  await store.refresh()
}
