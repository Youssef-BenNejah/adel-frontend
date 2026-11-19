// Like createStore.js, but backed by the real backend instead of localStorage.
// `fetcher()` is called once (lazily, on first subscribe) to populate the
// in-memory cache; `set`/mutations update the cache directly from whatever
// the server returned so every subscriber (useSyncExternalStore) re-renders.
import { useEffect, useSyncExternalStore } from 'react'

export function createAsyncStore(fetcher, seed = []) {
  let cache = seed
  let loaded = false
  let loading = null
  const listeners = new Set()

  function emit() {
    listeners.forEach((l) => l())
  }

  function set(value) {
    cache = value
    emit()
  }

  function update(updater) {
    cache = typeof updater === 'function' ? updater(cache) : updater
    emit()
    return cache
  }

  async function ensureLoaded() {
    if (loaded) return cache
    if (!loading) {
      loading = fetcher()
        .then((data) => {
          cache = data
          loaded = true
          emit()
          return cache
        })
        .catch((err) => {
          loading = null
          throw err
        })
    }
    return loading
  }

  function refresh() {
    loaded = false
    loading = null
    return ensureLoaded()
  }

  function subscribe(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  function getSnapshot() {
    return cache
  }

  function load() {
    return cache
  }

  function useStoreValue() {
    useEffect(() => {
      ensureLoaded().catch(() => {})
    }, [])
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }

  function isLoaded() {
    return loaded
  }

  // So pages can tell "still loading" apart from "confirmed not found" before
  // deciding to redirect away — the initial cache is an empty seed, not an answer.
  function useLoaded() {
    useEffect(() => {
      ensureLoaded().catch(() => {})
    }, [])
    return useSyncExternalStore(subscribe, isLoaded, isLoaded)
  }

  return { load, set, update, subscribe, getSnapshot, useStoreValue, ensureLoaded, refresh, isLoaded, useLoaded }
}
