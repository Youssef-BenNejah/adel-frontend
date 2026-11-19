import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

const store = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/promotions')
  return res.data
})

export const usePromotions = store.useStoreValue
export const getPromotions = store.load

function normalize(input, prevProductIds = []) {
  const scope = input.scope === 'products' ? 'products' : 'all'
  return {
    label: input.label?.trim() || 'Promotion',
    code: input.code ? input.code.trim().toUpperCase() : null,
    scope,
    productIds: scope === 'products' ? input.productIds ?? prevProductIds : [],
    discountType: input.discountType === 'fixed' ? 'fixed' : 'percent',
    value: Math.max(0, Number(input.value) || 0),
    active: input.active !== false,
  }
}

export async function addPromotion(input) {
  const res = await api.postAdmin('/admin/promotions', normalize(input))
  store.update((prev) => [res.data, ...prev])
  return res.data
}

export async function updatePromotion(id, patch) {
  const current = store.load().find((p) => p.id === id)
  const res = await api.patch(`/admin/promotions/${id}`, normalize({ ...current, ...patch }, current?.productIds))
  store.update((prev) => prev.map((p) => (p.id === id ? res.data : p)))
}

export async function deletePromotion(id) {
  await api.delete(`/admin/promotions/${id}`)
  store.update((prev) => prev.filter((p) => p.id !== id))
}

export async function togglePromotion(id) {
  const res = await api.patch(`/admin/promotions/${id}/toggle`)
  store.update((prev) => prev.map((p) => (p.id === id ? res.data : p)))
}

export function describePromo(promo) {
  const amount = promo.discountType === 'percent' ? `-${promo.value}%` : `-${promo.value} TND`
  const scope = promo.scope === 'all' ? 'Tous les produits' : `${promo.productIds.length} produit(s)`
  return { amount, scope }
}
