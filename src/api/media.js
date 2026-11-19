import { api } from './client.js'

/** One-shot admin media upload (image-upload-api.md §4) — returns { id, url, ... }. */
export async function uploadMedia(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await api.postAdminForm('/admin/media', form)
  return res.data
}
