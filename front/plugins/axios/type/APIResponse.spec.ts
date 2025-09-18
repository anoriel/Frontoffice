import type { APIResponse } from './APIResponse'

describe('APIResponse Type', () => {
  describe('Type Structure', () => {
    it('should have success property as boolean', () => {
      const response: APIResponse<string> = {
        success: true,
        content: 'test data'
      }

      expect(typeof response.success).toBe('boolean')
      expect(response.success).toBe(true)
    })

    it('should have content property of generic type', () => {
      const stringResponse: APIResponse<string> = {
        success: true,
        content: 'test string'
      }

      const numberResponse: APIResponse<number> = {
        success: true,
        content: 42
      }

      const objectResponse: APIResponse<{ id: number }> = {
        success: true,
        content: { id: 1 }
      }

      expect(typeof stringResponse.content).toBe('string')
      expect(typeof numberResponse.content).toBe('number')
      expect(typeof objectResponse.content).toBe('object')
    })

    it('should have optional status property', () => {
      const responseWithStatus: APIResponse<string> = {
        success: true,
        content: 'test',
        status: 200
      }

      const responseWithoutStatus: APIResponse<string> = {
        success: true,
        content: 'test'
      }

      expect(responseWithStatus.status).toBe(200)
      expect(responseWithoutStatus.status).toBeUndefined()
    })
  })

  describe('Type Flexibility', () => {
    it('should work with array types', () => {
      const arrayResponse: APIResponse<string[]> = {
        success: true,
        content: ['item1', 'item2']
      }

      expect(Array.isArray(arrayResponse.content)).toBe(true)
      expect(arrayResponse.content.length).toBe(2)
    })

    it('should work with complex object types', () => {
      interface User {
        id: number
        name: string
        email: string
      }

      const userResponse: APIResponse<User> = {
        success: true,
        content: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        },
        status: 201
      }

      expect(userResponse.content.id).toBe(1)
      expect(userResponse.content.name).toBe('John Doe')
      expect(userResponse.content.email).toBe('john@example.com')
      expect(userResponse.status).toBe(201)
    })

    it('should work with null/undefined content', () => {
      const nullResponse: APIResponse<null> = {
        success: false,
        content: null
      }

      const undefinedResponse: APIResponse<undefined> = {
        success: false,
        content: undefined
      }

      expect(nullResponse.content).toBeNull()
      expect(undefinedResponse.content).toBeUndefined()
    })
  })

  describe('Success/Error States', () => {
    it('should represent successful responses', () => {
      const successResponse: APIResponse<{ data: string }> = {
        success: true,
        content: { data: 'operation completed' },
        status: 200
      }

      expect(successResponse.success).toBe(true)
      expect(successResponse.status).toBe(200)
    })

    it('should represent error responses', () => {
      const errorResponse: APIResponse<{ error: string }> = {
        success: false,
        content: { error: 'Something went wrong' },
        status: 500
      }

      expect(errorResponse.success).toBe(false)
      expect(errorResponse.status).toBe(500)
      expect(errorResponse.content.error).toBe('Something went wrong')
    })
  })

  describe('HTTP Status Codes', () => {
    it('should support various HTTP status codes', () => {
      const responses = [
        { success: true, content: 'OK', status: 200 },
        { success: true, content: 'Created', status: 201 },
        { success: false, content: 'Bad Request', status: 400 },
        { success: false, content: 'Unauthorized', status: 401 },
        { success: false, content: 'Not Found', status: 404 },
        { success: false, content: 'Server Error', status: 500 }
      ] as APIResponse<string>[]

      responses.forEach(response => {
        expect(typeof response.status).toBe('number')
        expect(response.status).toBeGreaterThan(0)
      })
    })
  })

  describe('Real-world Usage Examples', () => {
    it('should work with paginated API responses', () => {
      interface PaginatedData<T> {
        items: T[]
        totalCount: number
        page: number
        pageSize: number
      }

      const paginatedResponse: APIResponse<PaginatedData<{ id: number; name: string }>> = {
        success: true,
        content: {
          items: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
          ],
          totalCount: 100,
          page: 1,
          pageSize: 10
        },
        status: 200
      }

      expect(paginatedResponse.content.items).toHaveLength(2)
      expect(paginatedResponse.content.totalCount).toBe(100)
    })

    it('should work with authentication responses', () => {
      interface AuthResponse {
        token: string
        refreshToken: string
        user: {
          id: number
          username: string
        }
      }

      const authResponse: APIResponse<AuthResponse> = {
        success: true,
        content: {
          token: 'jwt-token-here',
          refreshToken: 'refresh-token-here',
          user: {
            id: 1,
            username: 'johndoe'
          }
        },
        status: 200
      }

      expect(authResponse.content.token).toBeDefined()
      expect(authResponse.content.user.id).toBe(1)
    })
  })
})