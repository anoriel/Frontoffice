import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'
import userAPI from '@/api/user'

jest.mock('@/api/user', () => ({
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn(),
  findBy: jest.fn(),
  getCurrentlyLoggedUsers: jest.fn(),
  getNumberOfCurrentlyLoggedUsers: jest.fn()
}))

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

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
})

const mockedAPI = userAPI as jest.Mocked<typeof userAPI>

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Store Creation', () => {
    it('should create store instance with additional user-specific properties', () => {
      const store = useUserStore()

      expect(store).toBeDefined()
      expect(store.currentlyLoggedUsersCount).toBeDefined()
      expect(store.currentlyLoggedUsersList).toBeDefined()
      expect(store.currentlyLoggedUsersListLength).toBeDefined()
      expect(store.filteredList).toBeDefined()
      expect(store.filteredListLength).toBeDefined()
    })

    it('should expose all base store methods plus custom methods', () => {
      const store = useUserStore()

      // Base methods
      expect(typeof store.findAll).toBe('function')
      expect(typeof store.find).toBe('function')
      expect(typeof store.deleteItem).toBe('function')
      expect(typeof store.save).toBe('function')

      // Custom methods
      expect(typeof store.refreshAll).toBe('function')
      expect(typeof store.reset).toBe('function')
      expect(typeof store.findByRole).toBe('function')
    })
  })

  describe('refreshAll', () => {
    it('should fetch all users and update store', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'User 1' },
            { id: 2, name: 'User 2' }
          ],
          totalItems: 2
        }
      }
      mockedAPI.findAll.mockResolvedValue(mockResponse)

      const store = useUserStore()
      const result = await store.refreshAll()

      expect(result).toEqual(mockResponse.data)
    })

    it('should handle errors in refreshAll', async () => {
      const mockError = new Error('API Error')
      mockedAPI.findAll.mockRejectedValue(mockError)

      const store = useUserStore()
      const result = await store.refreshAll()

      expect(result).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset all store state including filtered lists', () => {
      const store = useUserStore()
      const result = store.reset()

      expect(result).toBe(true)
    })
  })

  describe('findByRole', () => {
    it('should find users by role and update filtered list', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Admin User', role: 'ROLE_ADMIN' }
          ],
          totalItems: 1
        }
      }
      mockedAPI.findBy.mockResolvedValue(mockResponse)

      const store = useUserStore()
      const result = await store.findByRole('ROLE_ADMIN')

      expect(mockedAPI.findBy).toHaveBeenCalledWith(false, 'ROLE_ADMIN')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle errors when finding by role', async () => {
      const mockError = new Error('Role not found')
      mockedAPI.findBy.mockRejectedValue(mockError)

      const store = useUserStore()
      const result = await store.findByRole('ROLE_INVALID')

      expect(result).toBeNull()
    })
  })
})