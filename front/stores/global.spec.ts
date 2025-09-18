import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore } from './global'

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
})

describe('Global Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    // Mock sessionStorage default values
    const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
    mockSessionStorage.getItem.mockReturnValue('20')
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const store = useGlobalStore()

      expect(store.backgroundLoadingRequestsCount).toBe(0)
      expect(store.isBackgroundLoading).toBe(false)
      expect(store.perPage).toBe(20)
      expect(store.perPageOptions).toEqual([1, 3, 5, 10, 20, 50, 100, 200])
    })

    it('should read perPage from sessionStorage', () => {
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockSessionStorage.getItem.mockReturnValue('50')

      const store = useGlobalStore()

      expect(store.perPage).toBe(50)
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('perPage')
    })

    it('should use default perPage when sessionStorage is null', () => {
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockSessionStorage.getItem.mockReturnValue(null)

      const store = useGlobalStore()

      expect(store.perPage).toBe(20)
    })
  })

  describe('setIsBackgroundLoading', () => {
    it('should increment counter when setting to true', () => {
      const store = useGlobalStore()

      const result = store.setIsBackgroundLoading(true)

      expect(store.backgroundLoadingRequestsCount).toBe(1)
      expect(store.isBackgroundLoading).toBe(true)
      expect(result).toBe(true)
    })

    it('should decrement counter when setting to false', () => {
      const store = useGlobalStore()

      store.setIsBackgroundLoading(true)
      store.setIsBackgroundLoading(true)
      expect(store.backgroundLoadingRequestsCount).toBe(2)

      const result = store.setIsBackgroundLoading(false)

      expect(store.backgroundLoadingRequestsCount).toBe(1)
      expect(store.isBackgroundLoading).toBe(true)
      expect(result).toBe(true)
    })

    it('should set isBackgroundLoading to false when counter reaches 0', () => {
      const store = useGlobalStore()

      store.setIsBackgroundLoading(true)
      expect(store.isBackgroundLoading).toBe(true)

      store.setIsBackgroundLoading(false)

      expect(store.backgroundLoadingRequestsCount).toBe(0)
      expect(store.isBackgroundLoading).toBe(false)
    })

    it('should handle negative counter by resetting to 0', () => {
      const store = useGlobalStore()

      // Manually set negative value
      store.backgroundLoadingRequestsCount = -5

      store.setIsBackgroundLoading(true)

      expect(store.backgroundLoadingRequestsCount).toBe(1)
      expect(store.isBackgroundLoading).toBe(true)
    })

    it('should allow going below 0', () => {
      const store = useGlobalStore()

      store.setIsBackgroundLoading(false)

      expect(store.backgroundLoadingRequestsCount).toBe(-1)
      expect(store.isBackgroundLoading).toBe(false)
    })
  })

  describe('setPerPage', () => {
    it('should set perPage value and save to sessionStorage', () => {
      const store = useGlobalStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>

      store.setPerPage(100)

      expect(store.perPage).toBe(100)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('perPage', '100')
    })

    it('should handle different perPage values', () => {
      const store = useGlobalStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>

      store.setPerPage(5)
      expect(store.perPage).toBe(5)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('perPage', '5')

      store.setPerPage(200)
      expect(store.perPage).toBe(200)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('perPage', '200')
    })
  })

  describe('Multiple background loading requests', () => {
    it('should handle multiple concurrent background loading requests', () => {
      const store = useGlobalStore()

      // Start 3 background requests
      store.setIsBackgroundLoading(true)
      store.setIsBackgroundLoading(true)
      store.setIsBackgroundLoading(true)

      expect(store.backgroundLoadingRequestsCount).toBe(3)
      expect(store.isBackgroundLoading).toBe(true)

      // End 2 requests
      store.setIsBackgroundLoading(false)
      store.setIsBackgroundLoading(false)

      expect(store.backgroundLoadingRequestsCount).toBe(1)
      expect(store.isBackgroundLoading).toBe(true)

      // End last request
      store.setIsBackgroundLoading(false)

      expect(store.backgroundLoadingRequestsCount).toBe(0)
      expect(store.isBackgroundLoading).toBe(false)
    })
  })
})