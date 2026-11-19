import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'
import { toApiItems } from '../api/cart.js'

const ALL_PAGE_SIZE = 1000

const store = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/orders', { pageSize: ALL_PAGE_SIZE })
  return res.data
})

export const useOrders = store.useStoreValue
export const getAllOrders = store.load

export const ORDER_STATUSES = ['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée']

/** Public checkout — server recomputes pricing from scratch (§10/§11), never trusts the client. */
export async function placeOrder({ items, promoCode, customer }) {
  const res = await api.post('/orders', { items: toApiItems(items), promoCode: promoCode || null, customer })
  return res.data
}

export async function updateOrderStatus(id, status) {
  const res = await api.patch(`/admin/orders/${id}/status`, { status })
  store.update((prev) => prev.map((o) => (o.id === id ? res.data : o)))
}

export async function deleteOrder(id) {
  await api.delete(`/admin/orders/${id}`)
  store.update((prev) => prev.filter((o) => o.id !== id))
}
