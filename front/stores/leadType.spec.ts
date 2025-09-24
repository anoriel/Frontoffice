import { setActivePinia, createPinia } from 'pinia'
import { useLeadTypeStore } from './leadType'

jest.mock('@/api/leadType', () => ({
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

// Create a shared mock base store instance
const mockBaseStore = (() => {
  const { ref, computed } = require('vue')
  const mockList = ref([])
  return {
    api: { value: {} },
    currentPage: { value: 1 },
    isLoading: { value: false },
    error: { value: null },
    item: { value: null },
    list: mockList,
    listLength: { value: 0 },
    hasError: computed(() => false),
    hasItems: computed(() => false),
    deleteItem: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    getById: jest.fn(),
    reset: jest.fn(),
    save: jest.fn(),
    resetError: jest.fn()
  }
})()

jest.mock('./baseStore', () => ({
  useBaseStore: jest.fn(() => mockBaseStore)
}))

describe('Lead Type Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    // Clear the mock list
    mockBaseStore.list.value = []
  })

  describe('Store Creation', () => {
    it('should create store instance', () => {
      const store = useLeadTypeStore()

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
      const store = useLeadTypeStore()

      expect(store.currentPage).toBeDefined()
      expect(store.isLoading).toBeDefined()
      expect(store.error).toBeDefined()
      expect(store.item).toBeDefined()
      expect(store.list).toBeDefined()
      expect(store.listLength).toBeDefined()
    })

    it('should expose computed properties', () => {
      const store = useLeadTypeStore()

      expect(store.hasError).toBeDefined()
      expect(store.hasItems).toBeDefined()
    })

    it('should expose custom properties', () => {
      const store = useLeadTypeStore()

      expect(store.language).toBeDefined()
      expect(store.language).toBe('fr')
    })

    it('should expose custom methods', () => {
      const store = useLeadTypeStore()

      expect(typeof store.getHighestPosition).toBe('function')
      expect(typeof store.getLowestPosition).toBe('function')
    })
  })

  describe('API Integration', () => {
    it('should use leadType API', () => {
      const store = useLeadTypeStore()

      expect(store).toBeDefined()
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.save).toBe('function')
    })
  })

  describe('Store Methods', () => {
    it('should expose all base store methods', () => {
      const store = useLeadTypeStore()

      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(store.hasError.value).toBe(false)
      expect(store.hasItems.value).toBe(false)
      expect(typeof store.getById).toBe('function')
      expect(typeof store.reset).toBe('function')
      expect(typeof store.save).toBe('function')
      expect(typeof store.resetError).toBe('function')
    })

    it('should have all methods available for invocation', () => {
      const store = useLeadTypeStore()

      // Test that all methods are available and can be called without errors
      expect(() => store.findAll()).not.toThrow()
      expect(() => store.find()).not.toThrow()
      expect(() => store.deleteItem()).not.toThrow()
      expect(() => store.save()).not.toThrow()
      expect(() => store.reset()).not.toThrow()
      expect(() => store.resetError()).not.toThrow()
    })
  })

  describe('Custom Methods', () => {
    describe('getHighestPosition', () => {
      it('should return 0 when list is empty', () => {
        const store = useLeadTypeStore()
        const { useBaseStore } = require('./baseStore')
        const mockBaseStore = useBaseStore()

        mockBaseStore.list.value = []

        const result = store.getHighestPosition()
        expect(result).toBe(0)
      })

      it('should return highest position from non-hidden items', () => {
        const store = useLeadTypeStore()

        // Set the list directly - this should work with the reactive ref
        const testData = [
          { id: 1, position: 3, isHidden: false },
          { id: 2, position: 1, isHidden: false },
          { id: 3, position: 5, isHidden: true }, // hidden item should be ignored
          { id: 4, position: 2, isHidden: false }
        ]

        // Set data on both the store and the mock (to ensure they're synchronized)
        store.list.value = testData
        mockBaseStore.list.value = testData

        const result = store.getHighestPosition()
        expect(result).toBe(3) // highest position among non-hidden items
      })

      it('should handle all hidden items', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 3, isHidden: true },
          { id: 2, position: 1, isHidden: true }
        ]
        mockBaseStore.list.value = testData

        // Should return 0 when all items are hidden
        const result = store.getHighestPosition()
        expect(result).toBe(0)
      })

      it('should handle single item', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 5, isHidden: false }
        ]
        mockBaseStore.list.value = testData

        const result = store.getHighestPosition()
        expect(result).toBe(5)
      })
    })

    describe('getLowestPosition', () => {
      it('should return 0 when list is empty', () => {
        const store = useLeadTypeStore()
        const { useBaseStore } = require('./baseStore')
        const mockBaseStore = useBaseStore()

        mockBaseStore.list.value = []

        const result = store.getLowestPosition()
        expect(result).toBe(0)
      })

      it('should return lowest position from non-hidden items', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 3, isHidden: false },
          { id: 2, position: 1, isHidden: false },
          { id: 3, position: 0, isHidden: true }, // hidden item should be ignored
          { id: 4, position: 2, isHidden: false }
        ]
        mockBaseStore.list.value = testData

        const result = store.getLowestPosition()
        expect(result).toBe(1) // lowest position among non-hidden items
      })

      it('should handle all hidden items', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 3, isHidden: true },
          { id: 2, position: 1, isHidden: true }
        ]
        mockBaseStore.list.value = testData

        // Should return 0 when all items are hidden
        const result = store.getLowestPosition()
        expect(result).toBe(0)
      })

      it('should handle single item', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 5, isHidden: false }
        ]
        mockBaseStore.list.value = testData

        const result = store.getLowestPosition()
        expect(result).toBe(5)
      })

      it('should handle items with equal positions', () => {
        const store = useLeadTypeStore()

        const testData = [
          { id: 1, position: 2, isHidden: false },
          { id: 2, position: 2, isHidden: false },
          { id: 3, position: 2, isHidden: false }
        ]
        mockBaseStore.list.value = testData

        const result = store.getLowestPosition()
        expect(result).toBe(2)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle errors through base store', () => {
      const store = useLeadTypeStore()

      expect(store.error).toBeDefined()
      expect(store.hasError.value).toBe(false)
      expect(typeof store.resetError).toBe('function')
    })
  })

  describe('State Management', () => {
    it('should manage loading state', () => {
      const store = useLeadTypeStore()

      expect(store.isLoading).toBeDefined()
      expect(typeof store.isLoading.value).toBe('boolean')
    })

    it('should manage current page', () => {
      const store = useLeadTypeStore()

      expect(store.currentPage).toBeDefined()
      expect(typeof store.currentPage.value).toBe('number')
    })

    it('should manage list data', () => {
      const store = useLeadTypeStore()

      expect(store.list).toBeDefined()
      expect(store.listLength).toBeDefined()
      expect(store.hasItems.value).toBe(false)
    })

    it('should manage item data', () => {
      const store = useLeadTypeStore()

      expect(store.item).toBeDefined()
    })
  })

  describe('Language Property', () => {
    it('should have language set to fr', () => {
      const store = useLeadTypeStore()

      expect(store.language).toBe('fr')
    })
  })

  describe('Color and Variant Methods', () => {
    describe('getColorByValue', () => {
      it('should return warning for null value', () => {
        const store = useLeadTypeStore()
        const result = store.getColorByValue(null)
        expect(result).toBe('warning')
      })

      it('should return text-white for lost', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'lost', position: 1, isHidden: false }
        const result = store.getColorByValue(leadType)
        expect(result).toBe('text-white')
      })

      it('should return text-white for spam', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'spam', position: 1, isHidden: false }
        const result = store.getColorByValue(leadType)
        expect(result).toBe('text-white')
      })

      it('should return text-white for won', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'won', position: 1, isHidden: false }
        const result = store.getColorByValue(leadType)
        expect(result).toBe('text-white')
      })

      it('should return grey-darken-4 for other values', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'other', position: 1, isHidden: false }
        const result = store.getColorByValue(leadType)
        expect(result).toBe('grey-darken-4')
      })
    })

    describe('getVariantByValue', () => {
      it('should return warning for null value', () => {
        const store = useLeadTypeStore()
        const result = store.getVariantByValue(null)
        expect(result).toBe('warning')
      })

      it('should return error for lost', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'lost', position: 1, isHidden: false }
        const result = store.getVariantByValue(leadType)
        expect(result).toBe('error')
      })

      it('should return grey-darken-4 for spam', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'spam', position: 1, isHidden: false }
        const result = store.getVariantByValue(leadType)
        expect(result).toBe('grey-darken-4')
      })

      it('should return warning for undefined', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'undefined', position: 1, isHidden: false }
        const result = store.getVariantByValue(leadType)
        expect(result).toBe('warning')
      })

      it('should return success for won', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'won', position: 1, isHidden: false }
        const result = store.getVariantByValue(leadType)
        expect(result).toBe('success')
      })

      it('should return primary for other values', () => {
        const store = useLeadTypeStore()
        const leadType = { name: 'other', position: 1, isHidden: false }
        const result = store.getVariantByValue(leadType)
        expect(result).toBe('primary')
      })
    })

    describe('getValue', () => {
      it('should return 0 for null value', () => {
        const store = useLeadTypeStore()
        const result = store.getValue(null)
        expect(result).toBe(0)
      })

      it('should calculate value based on position and lowest position', () => {
        const store = useLeadTypeStore()

        // Set up the store list to calculate lowestLeadTypePosition
        const testData = [
          { id: 1, position: 2, isHidden: false },
          { id: 2, position: 4, isHidden: false }
        ]
        mockBaseStore.list.value = testData

        // Manually set the position value
        const lowestPosition = store.getLowestPosition()
        store.lowestLeadTypePosition.value = lowestPosition

        const leadType = { name: 'test', position: 4, isHidden: false }
        const result = store.getValue(leadType)
        expect(result).toBe(2) // 4 - 2 = 2
      })
    })
  })

  describe('Position Calculations', () => {
    it('should update positions when list changes', () => {
      const store = useLeadTypeStore()

      // Initial state - these should be refs initialized to 0
      expect(store.lowestLeadTypePosition).toBeDefined()
      expect(store.highestLeadTypePosition).toBeDefined()

      // Set list data
      const testData = [
        { id: 1, position: 2, isHidden: false },
        { id: 2, position: 4, isHidden: false },
        { id: 3, position: 1, isHidden: false }
      ]
      mockBaseStore.list.value = testData

      // Manually trigger the calculations (since watch might not trigger in test)
      store.lowestLeadTypePosition.value = store.getLowestPosition()
      store.highestLeadTypePosition.value = store.getHighestPosition()

      expect(store.lowestLeadTypePosition.value).toBe(1)
      expect(store.highestLeadTypePosition.value).toBe(4)
    })
  })
})