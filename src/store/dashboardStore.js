import { createAsyncStore } from './createAsyncStore.js'
import { api } from '../api/client.js'

/** §15.1 — every dashboard number pre-aggregated server-side in one call. */
const store = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/dashboard')
  return res.data
}, null)

export const useDashboard = store.useStoreValue
export const refreshDashboard = store.refresh
