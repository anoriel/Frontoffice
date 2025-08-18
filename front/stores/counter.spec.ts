import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const counter = useCounterStore()

    expect(counter.count).toBe(0)
    expect(counter.doubleCount).toBe(0)
  })

  it('increments count', () => {
    const counter = useCounterStore()

    counter.increment()

    expect(counter.count).toBe(1)
  })

  it('calculates doubleCount correctly', () => {
    const counter = useCounterStore()

    counter.increment()
    counter.increment()

    expect(counter.count).toBe(2)
    expect(counter.doubleCount).toBe(4)
  })

  it('doubleCount is reactive to count changes', () => {
    const counter = useCounterStore()

    expect(counter.doubleCount).toBe(0)

    counter.increment()
    expect(counter.doubleCount).toBe(2)

    counter.increment()
    expect(counter.doubleCount).toBe(4)
  })

  it('increment function exists and is callable', () => {
    const counter = useCounterStore()

    expect(typeof counter.increment).toBe('function')
    expect(() => counter.increment()).not.toThrow()
  })
})
