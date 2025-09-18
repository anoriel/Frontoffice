import axios from '@/plugins/axios/axios'
import user from './user'

jest.mock('@/plugins/axios/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
}))

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findItemsByType', () => {
    it('should call GET /utilisateurs with type filter', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'User 1', type: 'admin' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await user.findItemsByType('admin')

      expect(mockedAxios.get).toHaveBeenCalledWith('/utilisateurs?type=admin')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching users by type', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(user.findItemsByType('admin')).rejects.toThrow('Network error')
    })
  })

  describe('findBy', () => {
    it('should call GET /utilisateurs with default parameters', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'User 1' },
            { id: 2, name: 'User 2' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await user.findBy()

      expect(mockedAxios.get).toHaveBeenCalledWith('/utilisateurs?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false')
      expect(result).toEqual(mockResponse)
    })

    it('should call GET /utilisateurs with active filter', async () => {
      const mockResponse = { data: { member: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await user.findBy(true)

      expect(mockedAxios.get).toHaveBeenCalledWith('/utilisateurs?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false&actif=true')
    })

    it('should call GET /utilisateurs with role filter', async () => {
      const mockResponse = { data: { member: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await user.findBy(false, 'ROLE_ADMIN')

      expect(mockedAxios.get).toHaveBeenCalledWith('/utilisateurs?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false&rolesJson=ROLE_ADMIN')
    })

    it('should call GET /utilisateurs with both active and role filters', async () => {
      const mockResponse = { data: { member: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await user.findBy(true, 'ROLE_ADMIN')

      expect(mockedAxios.get).toHaveBeenCalledWith('/utilisateurs?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false&rolesJson=ROLE_ADMIN&actif=true')
    })

    it('should handle errors when finding users', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(user.findBy()).rejects.toThrow('Network error')
    })
  })

  describe('findAllActive', () => {
    it('should call findBy with active=true', async () => {
      const spy = jest.spyOn(user, 'findBy')
      const mockResponse = { data: { member: [] } }
      spy.mockResolvedValue(mockResponse)

      const result = await user.findAllActive()

      expect(spy).toHaveBeenCalledWith(true)
      expect(result).toEqual(mockResponse)

      spy.mockRestore()
    })
  })

  describe('getCurrentlyLoggedUsers', () => {
    it('should call GET /getCurrentlyLoggedUsers endpoint', async () => {
      const mockResponse = {
        data: {
          users: [
            { id: 1, username: 'user1', lastActivity: '2023-01-01T10:00:00Z' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await user.getCurrentlyLoggedUsers()

      expect(mockedAxios.get).toHaveBeenCalledWith('/getCurrentlyLoggedUsers')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching currently logged users', async () => {
      const mockError = new Error('Server error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(user.getCurrentlyLoggedUsers()).rejects.toThrow('Server error')
    })
  })

  describe('getNumberOfCurrentlyLoggedUsers', () => {
    it('should call GET /getCurrentlyLoggedUsers with countOnly parameter', async () => {
      const mockResponse = { data: { count: 5 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await user.getNumberOfCurrentlyLoggedUsers()

      expect(mockedAxios.get).toHaveBeenCalledWith('/getCurrentlyLoggedUsers?countOnly=1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching user count', async () => {
      const mockError = new Error('Server error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(user.getNumberOfCurrentlyLoggedUsers()).rejects.toThrow('Server error')
    })
  })

  it('should have baseUrl property', () => {
    expect(user.baseUrl).toBe('/utilisateurs')
  })

  it('should inherit base API methods', () => {
    expect(typeof user.findAll).toBe('function')
    expect(typeof user.find).toBe('function')
    expect(typeof user.delete).toBe('function')
    expect(typeof user.save).toBe('function')
    expect(typeof user.add).toBe('function')
    expect(typeof user.findPage).toBe('function')
  })
})