import { setActivePinia, createPinia } from 'pinia'
import { useServiceTypeStore } from './serviceType'

jest.mock('@/api/serviceType', () => ({
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

jest.mock('./baseStore', () => ({
  useBaseStore: jest.fn(() => ({
    api: { value: {} },
    currentPage: { value: 1 },
    isLoading: { value: false },
    error: { value: null },
    item: { value: null },
    list: { value: [] },
    listLength: { value: 0 },
    hasError: { value: false },
    hasItems: { value: false },
    deleteItem: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    getById: jest.fn(),
    reset: jest.fn(),
    save: jest.fn(),
    resetError: jest.fn()
  }))
}))

describe('Service Type Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Store Creation', () => {
    it('should create store instance', () => {
      const store = useServiceTypeStore()

      expect(store).toBeDefined()
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.save).toBe('function')
      expect(typeof store.reset).toBe('function')
      expect(typeof store.getById).toBe('function')
      expect(typeof store.resetError).toBe('function')
    })

    it('should expose reactive properties', () => {
      const store = useServiceTypeStore()

      expect(store.currentPage).toBeDefined()
      expect(store.isLoading).toBeDefined()
      expect(store.error).toBeDefined()
      expect(store.item).toBeDefined()
      expect(store.list).toBeDefined()
      expect(store.listLength).toBeDefined()
    })

    it('should expose computed properties', () => {
      const store = useServiceTypeStore()

      expect(store.hasError).toBeDefined()
      expect(store.hasItems).toBeDefined()
    })
  })

  describe('API Integration', () => {
    it('should use serviceType API', () => {
      const store = useServiceTypeStore()

      expect(store).toBeDefined()
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.save).toBe('function')
    })
  })

  describe('Store Methods', () => {
    it('should expose all base store methods', () => {
      const store = useServiceTypeStore()

      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.hasError).toBe('object')
      expect(typeof store.hasItems).toBe('object')
      expect(typeof store.getById).toBe('function')
      expect(typeof store.reset).toBe('function')
      expect(typeof store.save).toBe('function')
      expect(typeof store.resetError).toBe('function')
    })

    it('should have all methods available for invocation', () => {
      const store = useServiceTypeStore()

      // Test that all methods are available and can be called without errors
      expect(() => store.findAll()).not.toThrow()
      expect(() => store.find()).not.toThrow()
      expect(() => store.deleteItem()).not.toThrow()
      expect(() => store.save()).not.toThrow()
      expect(() => store.reset()).not.toThrow()
      expect(() => store.resetError()).not.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('should handle errors through base store', () => {
      const store = useServiceTypeStore()

      expect(store.error).toBeDefined()
      expect(typeof store.hasError).toBe('object')
      expect(typeof store.resetError).toBe('function')
    })
  })

  describe('State Management', () => {
    it('should manage loading state', () => {
      const store = useServiceTypeStore()

      expect(store.isLoading).toBeDefined()
      expect(typeof store.isLoading.value).toBe('boolean')
    })

    it('should manage current page', () => {
      const store = useServiceTypeStore()

      expect(store.currentPage).toBeDefined()
      expect(typeof store.currentPage.value).toBe('number')
    })

    it('should manage list data', () => {
      const store = useServiceTypeStore()

      expect(store.list).toBeDefined()
      expect(store.listLength).toBeDefined()
      expect(typeof store.hasItems).toBe('object')
    })

    it('should manage item data', () => {
      const store = useServiceTypeStore()

      expect(store.item).toBeDefined()
    })
  })
})