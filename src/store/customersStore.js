import { createAsyncStore } from './createAsyncStore.js'
import { api, ApiError } from '../api/client.js'

const ALL_PAGE_SIZE = 1000

const store = createAsyncStore(async () => {
  const res = await api.getAdmin('/admin/customers', { pageSize: ALL_PAGE_SIZE })
  return res.data
})

export const useCustomers = store.useStoreValue
export const getAllCustomers = store.load

export function findByEmail(email) {
  return store.load().find((c) => c.email.toLowerCase() === email.toLowerCase())
}

export async function addCustomer({ name, email, phone, password }) {
  try {
    const res = await api.postAdmin('/admin/customers', { name, email, phone, password })
    store.update((prev) => [res.data, ...prev])
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      throw new Error('Un compte existe déjà avec cet e-mail.')
    }
    throw err
  }
}

export async function deleteCustomer(id) {
  await api.delete(`/admin/customers/${id}`)
  store.update((prev) => prev.filter((c) => c.id !== id))
}
