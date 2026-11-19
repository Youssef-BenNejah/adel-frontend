import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

// Two sources: the public storefront only ever sees active packs (no auth),
// the admin dashboard manages the full list (auth required).
const publicStore = createAsyncStore(async () => {
  const res = await api.get('/packs')
  return res.data
})

const adminStore = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/packs')
  return res.data
})

function sorted(list) {
  return [...list].sort((a, b) => a.order - b.order)
}

/** Admin management view — active + inactive. */
export function usePacks() {
  return sorted(adminStore.useStoreValue())
}

/** Storefront — active only. */
export function useActivePacks() {
  return sorted(publicStore.useStoreValue())
}

export function getPacks() {
  return sorted(adminStore.load())
}

export function getPackById(id) {
  return adminStore.load().find((p) => p.id === id) || publicStore.load().find((p) => p.id === id)
}

function normalize(input, prevProductIds = []) {
  const scope = input.scope === 'products' ? 'products' : 'all'
  return {
    name: input.name?.trim() || 'Pack',
    price: Math.max(0, Number(input.price) || 0),
    size: Math.max(1, Math.min(10, Number(input.size) || 3)),
    scope,
    productIds: scope === 'products' ? input.productIds ?? prevProductIds : [],
    active: input.active !== false,
  }
}

export async function addPack(input) {
  const res = await api.postAdmin('/admin/packs', normalize(input))
  adminStore.update((prev) => [...prev, res.data])
  publicStore.refresh()
}

export async function updatePack(id, patch) {
  const current = adminStore.load().find((p) => p.id === id)
  const res = await api.patch(`/admin/packs/${id}`, normalize({ ...current, ...patch }, current?.productIds))
  adminStore.update((prev) => prev.map((p) => (p.id === id ? res.data : p)))
  publicStore.refresh()
}

export async function deletePack(id) {
  await api.delete(`/admin/packs/${id}`)
  await adminStore.refresh()
  publicStore.refresh()
}

export async function togglePack(id) {
  const res = await api.patch(`/admin/packs/${id}/toggle`)
  adminStore.update((prev) => prev.map((p) => (p.id === id ? res.data : p)))
  publicStore.refresh()
}
