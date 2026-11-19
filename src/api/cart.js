import { api } from './client.js'

/** Maps local cart lines (CartContext items, each carrying `meta` set when added) into the
 * backend's CartDtos.ItemRequest shape (backend-api-spec.md §10). */
export function toApiItems(items) {
  return items.map((i) => {
    if (i.meta?.type === 'pack') {
      return { packId: i.meta.packId, slotProductIds: i.meta.slotProductIds, qty: i.qty }
    }
    return { productId: i.meta?.productId ?? i.id, sizeMl: i.meta?.sizeMl, qty: i.qty }
  })
}

/** Public cart pricing — the server recomputes everything, never the client (§3.3/§3.5/§3.8). */
export async function quoteCart(items, promoCode) {
  const res = await api.post('/cart/quote', { items: toApiItems(items), promoCode: promoCode || null })
  return res.data
}

/** §8.6 — validates a promo code against the quoted lines, with a distinguishable reason on failure. */
export async function validatePromoCode(code, lines) {
  const res = await api.post('/cart/validate-code', {
    code,
    items: lines.map((l) => ({ id: l.id, price: l.unitPrice, qty: l.qty })),
  })
  return res.data
}
