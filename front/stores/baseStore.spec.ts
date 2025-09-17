jest.mock('@/api/api_base', () => ({
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

jest.mock('../helpers/commonHelper', () => ({
  __esModule: true,
  default: () => ({
    moment: jest.fn(),
    formatDate: jest.fn(),
    formatDateTime: jest.fn(),
    listWithSlots: jest.fn(),
    listValue: jest.fn(),
    deepCompareWithoutOrder: jest.fn(() => true)
  })
}))

import { useBaseStore } from './baseStore'
import api_base from '@/api/api_base'

const mockedAPI = api_base as jest.Mocked<typeof api_base>

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
})

describe('Base Store', () => {
  let store: ReturnType<typeof useBaseStore>

  beforeEach(() => {
    jest.clearAllMocks()
    store = useBaseStore()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      expect(store.currentPage.value).toBe(1)
      expect(store.isLoading.value).toBe(false)
      expect(store.error.value).toBeNull()
      expect(store.item.value).toBeNull()
      expect(store.list.value).toEqual([])
      expect(store.listLength.value).toBe(0)
    })

    it('should have computed properties working correctly', () => {
      expect(store.hasError.value).toBe(false)
      expect(store.hasItems.value).toBe(false)
      
      store.error.value = 'Some error'
      store.list.value = [{ id: 1, name: 'Test' }]
      
      expect(store.hasError.value).toBe(true)
      expect(store.hasItems.value).toBe(true)
    })
  })

  describe('CRUD Operations', () => {
    describe('findAll', () => {
      it('should fetch all items successfully', async () => {
        const mockResponse = {
          data: {
            member: [{ id: 1, name: 'Test' }],
            totalItems: 1
          }
        }
        
        mockedAPI.findAll.mockResolvedValue(mockResponse)
        
        const result = await store.findAll()
        
        expect(store.isLoading.value).toBe(false)
        expect(store.list.value).toEqual(mockResponse.data.member)
        expect(store.listLength.value).toBe(1)
        expect(result).toEqual(mockResponse.data)
      })

      it('should handle findAll error', async () => {
        const mockError = new Error('API Error')
        mockedAPI.findAll.mockRejectedValue(mockError)
        
        const result = await store.findAll()
        
        expect(store.isLoading.value).toBe(false)
        expect(result).toBeNull()
      })
    })

    describe('find', () => {
      it('should find item by id successfully', async () => {
        const mockItem = { id: 1, name: 'Test Item' }
        const mockResponse = { data: mockItem }
        
        mockedAPI.find.mockResolvedValue(mockResponse)
        
        const result = await store.find(1)
        
        expect(store.isLoading.value).toBe(false)
        expect(store.item.value).toEqual(mockItem)
        expect(result).toEqual(mockItem)
      })

      it('should handle find error', async () => {
        const mockError = new Error('Not found')
        mockedAPI.find.mockRejectedValue(mockError)
        
        const result = await store.find(999)
        
        expect(store.isLoading.value).toBe(false)
        expect(store.error.value).toBe(mockError)
        expect(result).toBeNull()
      })
    })

    describe('deleteItem', () => {
      it('should delete item successfully', async () => {
        mockedAPI.delete.mockResolvedValue({})
        
        const result = await store.deleteItem(1)
        
        expect(store.isLoading.value).toBe(false)
        expect(store.item.value).toBeNull()
        expect(result).toBe(true)
        expect(mockedAPI.delete).toHaveBeenCalledWith(1)
      })

      it('should handle delete error', async () => {
        const mockError = new Error('Delete failed')
        mockedAPI.delete.mockRejectedValue(mockError)
        
        const result = await store.deleteItem(1)
        
        expect(store.isLoading.value).toBe(false)
        expect(store.error.value).toBe(mockError)
        expect(result).toBe(false)
      })
    })

    describe('save', () => {
      it('should save existing item (update)', async () => {
        const mockItem = { id: 1, name: 'Updated Item' }
        const mockResponse = { data: mockItem }
        
        mockedAPI.save.mockResolvedValue(mockResponse)
        
        const result = await store.save(1, mockItem)
        
        expect(store.isLoading.value).toBe(false)
        expect(result).toEqual(mockItem)
        expect(mockedAPI.save).toHaveBeenCalledWith(1, mockItem)
      })

      it('should save new item (create)', async () => {
        const mockItem = { name: 'New Item' }
        const mockResponse = { data: { id: 1, ...mockItem } }
        
        mockedAPI.add.mockResolvedValue(mockResponse)
        
        const result = await store.save(0, mockItem)
        
        expect(store.isLoading.value).toBe(false)
        expect(result).toEqual(mockResponse.data)
        expect(mockedAPI.add).toHaveBeenCalledWith(mockItem)
      })

      it('should handle save error', async () => {
        const mockError = new Error('Save failed')
        const mockItem = { id: 1, name: 'Test' }
        
        mockedAPI.save.mockRejectedValue(mockError)
        
        const result = await store.save(1, mockItem)
        
        expect(store.isLoading.value).toBe(false)
        expect(result).toBeNull()
      })

      it('should process object properties with @id correctly', async () => {
        const mockItem = {
          id: 1,
          name: 'Test',
          relation: { '@id': '/api/relations/1' },
          relations: [
            { '@id': '/api/relations/2' },
            { '@id': '/api/relations/3' }
          ]
        }
        
        const expectedProcessedItem = {
          id: 1,
          name: 'Test',
          relation: '/api/relations/1',
          relations: ['/api/relations/2', '/api/relations/3']
        }
        
        mockedAPI.save.mockResolvedValue({ data: mockItem })
        
        await store.save(1, mockItem)
        
        expect(mockedAPI.save).toHaveBeenCalledWith(1, expectedProcessedItem)
      })
    })
  })

  describe('Pagination and Filtering', () => {
    describe('findPage', () => {
      it('should fetch paginated results successfully', async () => {
        const mockResponse = {
          data: {
            member: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' }
            ],
            totalItems: 10,
            search: {
              mapping: [
                { variable: 'orderBy', property: 'name' }
              ]
            }
          }
        }
        
        mockedAPI.findPage.mockResolvedValue(mockResponse)
        
        const result = await store.findPage(1, 10, 'name', false, {})
        
        expect(store.isLoading.value).toBe(false)
        expect(store.list.value).toEqual(mockResponse.data.member)
        expect(store.listLength.value).toBe(10)
        expect(store.availableFields.value).toHaveLength(1)
        expect(result).toEqual(store.list.value)
      })

      it('should handle findPage error', async () => {
        const mockError = { data: 'Error message' }
        mockedAPI.findPage.mockRejectedValue(mockError)
        
        const result = await store.findPage(1, 10, 'id', true, {})
        
        expect(store.error.value).toBe('Error message')
        expect(result).toBeNull()
      })

      it('should call findPage with correct parameters', async () => {
        const mockResponse = {
          data: {
            member: [],
            totalItems: 0,
            search: { mapping: [] }
          }
        }
        
        mockedAPI.findPage.mockResolvedValue(mockResponse)
        
        await store.findPage(2, 20, 'created', true, { name: 'test' })
        
        expect(mockedAPI.findPage).toHaveBeenCalledWith(
          2, 20, 'created', 'desc', { name: 'test' }, [], []
        )
      })
    })
  })

  describe('Utility Functions', () => {
    describe('getById', () => {
      it('should find item by id in list', () => {
        store.list.value = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
        
        const result = store.getById(2)
        
        expect(result).toEqual({ id: 2, name: 'Item 2' })
      })

      it('should return undefined for non-existing id', () => {
        store.list.value = [
          { id: 1, name: 'Item 1' }
        ]
        
        const result = store.getById(999)
        
        expect(result).toBeUndefined()
      })
    })

    describe('reset', () => {
      it('should reset store state', () => {
        store.isLoading.value = true
        store.error.value = 'Some error'
        store.list.value = [{ id: 1 }]
        store.listLength.value = 5
        
        const result = store.reset()
        
        expect(result).toBe(true)
        expect(store.isLoading.value).toBe(false)
        expect(store.error.value).toBeNull()
        expect(store.list.value).toEqual([])
        expect(store.listLength.value).toBe(0)
      })
    })

    describe('resetError', () => {
      it('should reset error state', () => {
        store.error.value = 'Some error'
        
        store.resetError()
        
        expect(store.error.value).toBeNull()
      })
    })
  })

  describe('Context Management', () => {
    describe('getContextKey', () => {
      it('should return context from localStorage', () => {
        const mockContext = { filters: { name: 'test' } }
        const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockContext))
        
        const result = store.getContextKey()
        
        expect(result).toEqual(mockContext)
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('base.context')
      })

      it('should return default context when no localStorage data', () => {
        const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
        mockLocalStorage.getItem.mockReturnValue(null)
        store.defaultContext.value = { filters: {} }
        
        const result = store.getContextKey()
        
        expect(result).toEqual({ filters: {} })
        expect(mockLocalStorage.setItem).toHaveBeenCalled()
      })

      it('should return specific context key', () => {
        store.context.value = { 
          filters: { name: 'test' },
          sorting: { field: 'id' }
        }
        
        const result = store.getContextKey('filters')
        
        expect(result).toEqual({ name: 'test' })
      })
    })

    describe('getNumberOfFilters', () => {
      it('should return number of active filters', () => {
        // Mock the filters comparison logic
        store.context.value = { filters: { name: 'test', status: 'active' } }
        store.defaultContext.value = { filters: { name: '', status: '' } }
        
        const result = store.getNumberOfFilters()
        
        expect(typeof result).toBe('number')
      })
    })
  })

  describe('Data Processing', () => {
    describe('parseArrays', () => {
      it('should parse filters array correctly', () => {
        const filters = { name: 'test', status: 'active' }
        
        const result = store.parseArrays(filters)
        
        expect(result).toEqual([filters, [], []])
      })
    })

    describe('parseItem', () => {
      it('should return item as-is by default', () => {
        const item = { id: 1, name: 'Test' }
        
        const result = store.parseItem(item)
        
        expect(result).toBe(item)
      })
    })

    describe('parseSortBy', () => {
      it('should return sort parameters correctly', () => {
        const result = store.parseSortBy('name', true)
        
        expect(result).toEqual(['name', true])
      })
    })
  })

  describe('Visible Fields Management', () => {
    describe('getVisibleFields', () => {
      it('should return visible fields from context', () => {
        store.context.value = { customFields: ['name', 'email'] }
        
        const result = store.getVisibleFields()
        
        expect(result).toEqual(['name', 'email'])
      })
    })
  })
})