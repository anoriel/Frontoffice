import axios from '@/plugins/axios/axios'
import security from './security'

jest.mock('@/plugins/axios/axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Security API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getApiMe', () => {
    it('should call GET /me endpoint', async () => {
      const mockResponse = { data: { id: 1, name: 'Test User' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await security.getApiMe()

      expect(mockedAxios.get).toHaveBeenCalledWith('/me')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(security.getApiMe()).rejects.toThrow('Network error')
    })
  })

  describe('getLongRequest', () => {
    it('should call GET /getLongRequest/1 endpoint', async () => {
      const mockResponse = { data: { status: 'success' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await security.getLongRequest()

      expect(mockedAxios.get).toHaveBeenCalledWith('/getLongRequest/1')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('login', () => {
    it('should call POST /login with credentials', async () => {
      const mockResponse = { data: { token: 'mock-token' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await security.login('testuser', 'testpass')

      expect(mockedAxios.post).toHaveBeenCalledWith('/login', {
        identifiant: 'testuser',
        mot_de_passe: 'testpass'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials')
      mockedAxios.post.mockRejectedValue(mockError)

      await expect(security.login('wrong', 'credentials')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('logout', () => {
    it('should call GET /logout endpoint', async () => {
      const mockResponse = { data: { success: true } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await security.logout()

      expect(mockedAxios.get).toHaveBeenCalledWith('/logout')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('loadRoleHierarchy', () => {
    it('should call GET /role_hierarchy endpoint', async () => {
      const mockResponse = { data: { roles: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await security.loadRoleHierarchy()

      expect(mockedAxios.get).toHaveBeenCalledWith('/role_hierarchy')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('loadRoleHierarchyMap', () => {
    it('should call GET /role_hierarchy_map endpoint', async () => {
      const mockResponse = { data: { map: {} } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await security.loadRoleHierarchyMap()

      expect(mockedAxios.get).toHaveBeenCalledWith('/role_hierarchy_map')
      expect(result).toEqual(mockResponse)
    })
  })
})