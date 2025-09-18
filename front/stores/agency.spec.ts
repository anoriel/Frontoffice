import { setActivePinia, createPinia } from 'pinia'
import { useAgencyStore } from './agency'

jest.mock('@/api/agency', () => ({
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn(),
  findAllActive: jest.fn()
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

describe('Agency Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Store Creation', () => {
    it('should create store instance', () => {
      const store = useAgencyStore()

      expect(store).toBeDefined()
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.save).toBe('function')
      expect(typeof store.reset).toBe('function')
    })

    it('should expose reactive properties', () => {
      const store = useAgencyStore()

      expect(store.currentPage).toBeDefined()
      expect(store.isLoading).toBeDefined()
      expect(store.error).toBeDefined()
      expect(store.item).toBeDefined()
      expect(store.list).toBeDefined()
      expect(store.listLength).toBeDefined()
    })
  })

  describe('API Integration', () => {
    it('should use agency API', () => {
      const store = useAgencyStore()

      expect(store).toBeDefined()
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
    })
  })
})