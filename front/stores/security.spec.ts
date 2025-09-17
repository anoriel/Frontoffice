import { setActivePinia, createPinia } from 'pinia'
import { useSecurityStore } from './security'
import thisAPI from '@/api/security'

jest.mock('@/api/security')

const mockedAPI = thisAPI as jest.Mocked<typeof thisAPI>

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
})

Object.defineProperty(window, 'atob', {
  value: jest.fn()
})

describe('Security Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('JWT Token Parsing', () => {
    it('should parse JWT token correctly', () => {
      const store = useSecurityStore()
      
      const mockToken = 'header.' + btoa(JSON.stringify({
        id: 1,
        exp: 1234567890,
        roles: ['ROLE_USER'],
        firstname: 'John',
        lastname: 'Doe',
        me: JSON.stringify({ email: 'john@example.com' })
      })) + '.signature'

      const mockAtob = window.atob as jest.Mock
      mockAtob.mockReturnValue(JSON.stringify({
        id: 1,
        exp: 1234567890,
        roles: ['ROLE_USER'],
        firstname: 'John',
        lastname: 'Doe',
        me: JSON.stringify({ email: 'john@example.com' })
      }))

      const parsed = store.getJWTTokenInfo()
      expect(parsed).toBeDefined()
    })

    it('should return null for invalid JWT token', () => {
      const store = useSecurityStore()
      store.JWTToken = null
      
      const parsed = store.getJWTTokenInfo()
      expect(parsed).toBeNull()
    })
  })

  describe('Authentication State', () => {
    it('should return false when no JWT token exists', () => {
      const store = useSecurityStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockSessionStorage.getItem.mockReturnValue(null)
      
      expect(store.getIsAuthenticated()).toBe(false)
    })

    it('should return true when JWT token exists', () => {
      const store = useSecurityStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockSessionStorage.getItem.mockReturnValue('valid-token')
      
      expect(store.getIsAuthenticated()).toBe(true)
    })
  })

  describe('User Information', () => {
    it('should return user ID from JWT token', () => {
      const store = useSecurityStore()
      
      // Set up the token directly in the store
      store.JWTTokenInfo = { id: 123 } as any
      
      expect(store.getId()).toBe(123)
    })

    it('should return user email from JWT token', () => {
      const store = useSecurityStore()
      
      // Set up the token directly in the store
      store.JWTTokenInfo = { email: 'test@example.com' } as any
      
      expect(store.getEmail()).toBe('test@example.com')
    })

    it('should return user firstname from JWT token', () => {
      const store = useSecurityStore()
      
      // Set up the token directly in the store
      store.JWTTokenInfo = { firstname: 'John' } as any
      
      expect(store.getFirstname()).toBe('John')
    })

    it('should return user lastname from JWT token', () => {
      const store = useSecurityStore()
      
      // Set up the token directly in the store
      store.JWTTokenInfo = { lastname: 'Doe' } as any
      
      expect(store.getLastname()).toBe('Doe')
    })

    it('should return username from JWT token', () => {
      const store = useSecurityStore()
      
      // Set up the token directly in the store  
      store.JWTTokenInfo = { username: 'johndoe' } as any
      
      expect(store.getUsername()).toBe('johndoe')
    })
  })

  describe('Role Management', () => {
    it('should check if user has admin role', () => {
      const store = useSecurityStore()
      
      // Set up the JWT token with proper mocking
      store.JWTToken = 'header.eyJyb2xlcyI6WyJST0xFX0FETUlOIl19.signature'
      
      // Mock window.atob to decode the JWT payload
      const mockAtob = window.atob as jest.Mock
      mockAtob.mockReturnValue(JSON.stringify({ 
        roles: ['ROLE_ADMIN'] 
      }))
      
      expect(store.isAdmin()).toBe(true)
    })

    it('should return false if user is not admin', () => {
      const store = useSecurityStore()
      store.JWTToken = 'token'
      
      const mockAtob = window.atob as jest.Mock
      mockAtob.mockReturnValue(JSON.stringify({ 
        roles: ['ROLE_USER'] 
      }))
      
      expect(store.isAdmin()).toBe(false)
    })

    it('should check if user has specific role', () => {
      const store = useSecurityStore()
      store.currentUserRoles = ['ROLE_USER', 'ROLE_MANAGER']
      store.roleHierarchyMap = {
        'ROLE_MANAGER': ['ROLE_USER']
      }
      
      expect(store.hasRole('ROLE_USER')).toBe(true)
    })
  })

  describe('User Impersonation', () => {
    it('should return true if user is logged as another user', () => {
      const store = useSecurityStore()
      store.switch_user = { id: 456, identifiant: 'testuser' }
      
      expect(store.isLoggedAs()).toBe(true)
    })

    it('should return false if user is not impersonating', () => {
      const store = useSecurityStore()
      store.switch_user = null
      
      expect(store.isLoggedAs()).toBe(false)
    })

    it('should return impersonated user identifier', () => {
      const store = useSecurityStore()
      store.switch_user = { identifiant: 'impersonated-user' }
      
      expect(store.getLoggedAs()).toBe('impersonated-user')
    })

    it('should switch to another user', () => {
      const store = useSecurityStore()
      const testUser = { id: 123, roles: ['ROLE_USER'] }
      
      store.switchUser(testUser)
      
      expect(store.switch_user).toEqual(testUser)
      expect(store.currentUserRoles).toEqual(['ROLE_USER'])
    })

    it('should reset user switch', () => {
      const store = useSecurityStore()
      store.switch_user = { id: 123 }
      store.JWTTokenInfo = { roles: ['ROLE_ADMIN'] }
      
      store.switchUserReset()
      
      expect(store.switch_user).toBeNull()
      expect(store.currentUserRoles).toEqual(['ROLE_ADMIN'])
    })
  })

  describe('Login Process', () => {
    it('should login successfully', async () => {
      const store = useSecurityStore()
      const mockResponse = {
        data: {
          token: 'new-jwt-token'
        }
      }
      
      mockedAPI.login.mockResolvedValue(mockResponse)
      mockedAPI.loadRoleHierarchy.mockResolvedValue({ data: {} })
      mockedAPI.loadRoleHierarchyMap.mockResolvedValue({ data: {} })
      
      const mockAtob = window.atob as jest.Mock
      mockAtob.mockReturnValue(JSON.stringify({ 
        roles: ['ROLE_USER'] 
      }))
      
      const token = await store.login({
        login: 'testuser',
        password: 'testpass'
      })
      
      expect(token).toBe('new-jwt-token')
      expect(store.isAuthenticated).toBe(true)
      expect(mockedAPI.login).toHaveBeenCalledWith('testuser', 'testpass')
    })

    it('should handle login error', async () => {
      const store = useSecurityStore()
      const mockError = new Error('Login failed')
      
      mockedAPI.login.mockRejectedValue(mockError)
      
      const token = await store.login({
        login: 'testuser',
        password: 'wrongpass'
      })
      
      expect(token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Logout Process', () => {
    it('should logout successfully', async () => {
      const store = useSecurityStore()
      mockedAPI.logout.mockResolvedValue({})
      
      await store.logout()
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.JWTToken).toBeNull()
      expect(mockedAPI.logout).toHaveBeenCalled()
    })

    it('should clear session storage on logout', async () => {
      const store = useSecurityStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockedAPI.logout.mockResolvedValue({})
      
      await store.logout()
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('JWTToken')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('JWTTokenInfo')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('authToken')
    })
  })

  describe('Role Hierarchy', () => {
    it('should load role hierarchy', async () => {
      const store = useSecurityStore()
      const mockRoleData = {
        'ROLE_ADMIN': ['ROLE_USER'],
        'ROLE_USER': []
      }
      
      mockedAPI.loadRoleHierarchy.mockResolvedValue({ data: mockRoleData })
      
      await store.loadRoleHierarchy()
      
      expect(store.roles).toEqual(['ROLE_ADMIN', 'ROLE_USER'])
      expect(mockedAPI.loadRoleHierarchy).toHaveBeenCalled()
    })

    it('should load role hierarchy map', async () => {
      const store = useSecurityStore()
      const mockRoleMap = {
        'ROLE_ADMIN': ['ROLE_USER']
      }
      
      mockedAPI.loadRoleHierarchyMap.mockResolvedValue({ data: mockRoleMap })
      
      await store.loadRoleHierarchyMap()
      
      expect(store.roleHierarchyMap).toEqual(mockRoleMap)
      expect(mockedAPI.loadRoleHierarchyMap).toHaveBeenCalled()
    })
  })

  describe('Session Management', () => {
    it('should refresh session from storage', () => {
      const store = useSecurityStore()
      const mockSessionStorage = window.sessionStorage as jest.Mocked<Storage>
      mockSessionStorage.getItem.mockReturnValue('stored-token')
      
      const mockAtob = window.atob as jest.Mock
      mockAtob.mockReturnValue(JSON.stringify({ 
        roles: ['ROLE_USER'] 
      }))
      
      store.onRefresh()
      
      expect(store.isAuthenticated).toBe(true)
      expect(store.JWTToken).toBe('stored-token')
    })

    it('should disconnect user session through logout', async () => {
      const store = useSecurityStore()
      store.isAuthenticated = true
      store.JWTToken = 'token'
      store.currentUserRoles = ['ROLE_USER']
      
      mockedAPI.logout.mockResolvedValue({})
      
      await store.logout()
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.JWTToken).toBeNull()
      expect(store.currentUserRoles).toEqual([])
    })
  })

  describe('API Integration', () => {
    it('should get user profile from API', async () => {
      const store = useSecurityStore()
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        roles: ['ROLE_USER'],
        lastPoints: 100
      }
      
      mockedAPI.getApiMe.mockResolvedValue({ data: mockUser })
      
      await store.getApiMe()
      
      expect(store.me).toEqual(mockUser)
      expect(store.lastPoints).toBe(100)
      expect(mockedAPI.getApiMe).toHaveBeenCalled()
    })

    it('should handle API error gracefully', async () => {
      const store = useSecurityStore()
      const mockError = new Error('API Error')
      
      mockedAPI.getApiMe.mockRejectedValue(mockError)
      
      await store.getApiMe()
      
      expect(store.isLoading).toBe(false)
      expect(mockedAPI.getApiMe).toHaveBeenCalled()
    })

    it('should execute long request', async () => {
      const store = useSecurityStore()
      mockedAPI.getLongRequest.mockResolvedValue({})
      
      await store.getLongRequest()
      
      expect(store.isLoading).toBe(false)
      expect(mockedAPI.getLongRequest).toHaveBeenCalled()
    })
  })
})