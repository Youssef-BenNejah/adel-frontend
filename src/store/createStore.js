// Tiny localStorage-backed store factory with pub/sub, so the storefront
// and the admin dashboard share one reactive "database" without a backend.
import { useSyncExternalStore } from 'react'

export function createStore(key, seedFn) {
  let cache = null
  const listeners = new Set()

  function load() {
    if (cache) return cache
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        cache = JSON.parse(raw)
        return cache
      }
    } catch {
      // ignore corrupt storage, fall through to reseed
    }
    cache = seedFn()
    persist()
    return cache
  }

  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(cache))
    } catch {
      // storage full/unavailable — state still works in-memory for this session
    }
  }

  function emit() {
    listeners.forEach((l) => l())
  }

  function set(updater) {
    const current = load()
    cache = typeof updater === 'function' ? updater(current) : updater
    persist()
    emit()
  }

  function subscribe(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  function getSnapshot() {
    return load()
  }

  function useStoreValue() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }

  return { load, set, subscribe, getSnapshot, useStoreValue }
}
