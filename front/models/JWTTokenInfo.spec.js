import TokenInfo from './JWTTokenInfo'

describe('TokenInfo (JWT Token Info)', () => {
  describe('Constructor', () => {
    it('should create instance with default values when no rawData provided', () => {
      const tokenInfo = new TokenInfo()

      expect(tokenInfo.exp).toBeNull() // BaseModel sets default value from constructor
      expect(tokenInfo.human_exp).toBeNull()
      expect(tokenInfo.human_iat).toBeNull()
      expect(tokenInfo.logged_at).toBeNull()
      expect(tokenInfo.iat).toBeNull()
      expect(tokenInfo.ip).toBeUndefined()
      expect(tokenInfo.roles).toEqual([]) // BaseModel sets default array
      expect(tokenInfo.firstname).toBeNull()
      expect(tokenInfo.lastname).toBeNull()
      expect(tokenInfo.username).toBeNull()
      expect(tokenInfo.id).toBeNull()
      expect(tokenInfo.authToken).toBeNull()
      expect(tokenInfo.legacyIntranetUrl).toBeNull()
      expect(tokenInfo.points).toBe(0) // BaseModel sets default number
      expect(tokenInfo.lastPoints).toBe(0)
    })

    it('should create instance with provided rawData', () => {
      const rawData = {
        exp: 1640995200,
        human_exp: '2021-12-31 23:59:59',
        human_iat: '2021-12-01 00:00:00',
        logged_at: '2021-12-01T00:00:00Z',
        iat: 1638316800,
        roles: ['ROLE_USER', 'ROLE_ADMIN'],
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        id: 123,
        authToken: 'abc123token',
        legacyIntranetUrl: 'https://legacy.example.com',
        points: 150,
        lastPoints: 100
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo.exp).toBe(1640995200)
      expect(tokenInfo.human_exp).toBe('2021-12-31 23:59:59')
      expect(tokenInfo.human_iat).toBe('2021-12-01 00:00:00')
      expect(tokenInfo.logged_at).toBe('2021-12-01T00:00:00Z')
      expect(tokenInfo.iat).toBe(1638316800)
      expect(tokenInfo.roles).toEqual(['ROLE_USER', 'ROLE_ADMIN'])
      expect(tokenInfo.firstname).toBe('John')
      expect(tokenInfo.lastname).toBe('Doe')
      expect(tokenInfo.username).toBe('johndoe')
      expect(tokenInfo.id).toBe(123)
      expect(tokenInfo.authToken).toBe('abc123token')
      expect(tokenInfo.legacyIntranetUrl).toBe('https://legacy.example.com')
      expect(tokenInfo.points).toBe(150)
      expect(tokenInfo.lastPoints).toBe(100)
    })

    it('should handle partial rawData', () => {
      const rawData = {
        username: 'partialuser',
        id: 456,
        roles: ['ROLE_USER']
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo.username).toBe('partialuser')
      expect(tokenInfo.id).toBe(456)
      expect(tokenInfo.roles).toEqual(['ROLE_USER'])
      expect(tokenInfo.exp).toBeUndefined()
      expect(tokenInfo.firstname).toBeUndefined()
      expect(tokenInfo.points).toBeUndefined()
    })

    it('should handle null and undefined values', () => {
      const rawData = {
        exp: null,
        username: undefined,
        id: 0,
        points: 0
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo.exp).toBeNull()
      expect(tokenInfo.username).toBeUndefined()
      expect(tokenInfo.id).toBe(0)
      expect(tokenInfo.points).toBe(0)
    })

    it('should handle empty strings and zero values', () => {
      const rawData = {
        firstname: '',
        lastname: '',
        username: 'user',
        id: 0,
        exp: 0,
        iat: 0,
        points: 0,
        lastPoints: 0
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo.firstname).toBe('')
      expect(tokenInfo.lastname).toBe('')
      expect(tokenInfo.username).toBe('user')
      expect(tokenInfo.id).toBe(0)
      expect(tokenInfo.exp).toBe(0)
      expect(tokenInfo.iat).toBe(0)
      expect(tokenInfo.points).toBe(0)
      expect(tokenInfo.lastPoints).toBe(0)
    })

    it('should handle empty arrays for roles', () => {
      const rawData = {
        roles: []
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo.roles).toEqual([])
    })

    it('should handle null rawData', () => {
      const tokenInfo = new TokenInfo(null)

      expect(tokenInfo.exp).toBeUndefined()
      expect(tokenInfo.username).toBeUndefined()
      expect(tokenInfo.roles).toBeUndefined()
    })
  })

  describe('Property Types', () => {
    it('should set number properties correctly', () => {
      const rawData = {
        exp: 1640995200,
        iat: 1638316800,
        id: 123,
        points: 150,
        lastPoints: 100
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(typeof tokenInfo.exp).toBe('number')
      expect(typeof tokenInfo.iat).toBe('number')
      expect(typeof tokenInfo.id).toBe('number')
      expect(typeof tokenInfo.points).toBe('number')
      expect(typeof tokenInfo.lastPoints).toBe('number')
    })

    it('should set string properties correctly', () => {
      const rawData = {
        human_exp: '2021-12-31 23:59:59',
        human_iat: '2021-12-01 00:00:00',
        logged_at: '2021-12-01T00:00:00Z',
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        authToken: 'abc123token',
        legacyIntranetUrl: 'https://legacy.example.com'
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(typeof tokenInfo.human_exp).toBe('string')
      expect(typeof tokenInfo.human_iat).toBe('string')
      expect(typeof tokenInfo.logged_at).toBe('string')
      expect(typeof tokenInfo.firstname).toBe('string')
      expect(typeof tokenInfo.lastname).toBe('string')
      expect(typeof tokenInfo.username).toBe('string')
      expect(typeof tokenInfo.authToken).toBe('string')
      expect(typeof tokenInfo.legacyIntranetUrl).toBe('string')
    })

    it('should set object/array properties correctly', () => {
      const rawData = {
        roles: ['ROLE_USER', 'ROLE_ADMIN']
      }

      const tokenInfo = new TokenInfo(rawData)

      expect(Array.isArray(tokenInfo.roles)).toBe(true)
      expect(tokenInfo.roles).toEqual(['ROLE_USER', 'ROLE_ADMIN'])
    })
  })

  describe('Inheritance', () => {
    it('should extend BaseModel', () => {
      const tokenInfo = new TokenInfo()

      expect(tokenInfo).toBeInstanceOf(TokenInfo)
      // Check if it has BaseModel methods
      expect(typeof tokenInfo.setString).toBe('function')
      expect(typeof tokenInfo.setNumber).toBe('function')
      expect(typeof tokenInfo.setObject).toBe('function')
    })

    it('should call parent constructor', () => {
      const rawData = { username: 'test' }
      const tokenInfo = new TokenInfo(rawData)

      expect(tokenInfo).toBeDefined()
    })
  })

  describe('Real-world JWT Token scenarios', () => {
    it('should handle typical JWT payload structure', () => {
      const jwtPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000), // now
        username: 'admin@example.com',
        id: 1,
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
        firstname: 'Admin',
        lastname: 'User'
      }

      const tokenInfo = new TokenInfo(jwtPayload)

      expect(tokenInfo.exp).toBe(jwtPayload.exp)
      expect(tokenInfo.iat).toBe(jwtPayload.iat)
      expect(tokenInfo.username).toBe('admin@example.com')
      expect(tokenInfo.id).toBe(1)
      expect(tokenInfo.roles).toEqual(['ROLE_ADMIN', 'ROLE_USER'])
      expect(tokenInfo.firstname).toBe('Admin')
      expect(tokenInfo.lastname).toBe('User')
    })

    it('should handle expired token data', () => {
      const expiredTokenData = {
        exp: 1609459200, // January 1, 2021 (past date)
        iat: 1609372800, // December 31, 2020
        username: 'expired@example.com',
        id: 999
      }

      const tokenInfo = new TokenInfo(expiredTokenData)

      expect(tokenInfo.exp).toBe(1609459200)
      expect(tokenInfo.iat).toBe(1609372800)
      expect(tokenInfo.username).toBe('expired@example.com')
    })

    it('should handle token with points system', () => {
      const tokenWithPoints = {
        username: 'user@example.com',
        id: 42,
        points: 1500,
        lastPoints: 1200,
        roles: ['ROLE_USER']
      }

      const tokenInfo = new TokenInfo(tokenWithPoints)

      expect(tokenInfo.points).toBe(1500)
      expect(tokenInfo.lastPoints).toBe(1200)
      expect(tokenInfo.username).toBe('user@example.com')
    })
  })
})