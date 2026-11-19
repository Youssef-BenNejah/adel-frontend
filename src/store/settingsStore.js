import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

const DEFAULTS = {
  freeShippingThreshold: 150,
  shippingFee: 8,
  storeName: 'Adel Fragrances',
  freeShippingCode: 'ALADIN10',
}

const store = createAsyncStore(async () => {
  const res = await api.get('/settings')
  return res.data
}, DEFAULTS)

export const useSettings = store.useStoreValue
export const getSettings = store.load

export async function updateSettings(patch) {
  const res = await api.patch('/admin/settings', patch)
  store.update(res.data)
}
