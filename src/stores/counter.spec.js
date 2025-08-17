import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('initializes with a count of 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increments the count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('doubles the count', () => {
    const store = useCounterStore()
    expect(store.doubleCount).toBe(0)
    store.increment()
    expect(store.doubleCount).toBe(2)
  })
})
