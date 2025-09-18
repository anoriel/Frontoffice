import serviceTypeAPI from './serviceType'
import axios from '@/plugins/axios/axios'

jest.mock('@/plugins/axios/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
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

jest.mock('deepmerge-json', () => jest.fn((base, override) => ({
  ...base,
  ...override
})))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Service Type API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('API Structure', () => {
    it('should have correct baseUrl', () => {
      expect(serviceTypeAPI.baseUrl).toBe('/service_types')
    })

    it('should inherit all base API methods', () => {
      expect(typeof serviceTypeAPI.findAll).toBe('function')
      expect(typeof serviceTypeAPI.find).toBe('function')
      expect(typeof serviceTypeAPI.delete).toBe('function')
      expect(typeof serviceTypeAPI.save).toBe('function')
      expect(typeof serviceTypeAPI.add).toBe('function')
      expect(typeof serviceTypeAPI.findPage).toBe('function')
    })
  })

  describe('findAll method', () => {
    it('should call axios with correct URL and parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      expect(mockedAxios.get).toHaveBeenCalledWith('/service_types?orderBy[name]=asc&pagination=false')
    })

    it('should return response from axios', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Test Service Type' }
          ],
          totalItems: 1
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await serviceTypeAPI.findAll()

      expect(result).toEqual(mockResponse)
    })

    it('should handle errors properly', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(serviceTypeAPI.findAll()).rejects.toThrow('Network error')
    })
  })

  describe('API Integration', () => {
    it('should merge base API with custom implementation', () => {
      expect(serviceTypeAPI).toBeDefined()
      expect(serviceTypeAPI.baseUrl).toBe('/service_types')
    })

    it('should override base findAll with custom implementation', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  describe('URL Construction', () => {
    it('should construct correct URL with query parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      const expectedUrl = '/service_types?orderBy[name]=asc&pagination=false'
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('should include sorting parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      const callArgs = mockedAxios.get.mock.calls[0][0]
      expect(callArgs).toContain('orderBy[name]=asc')
    })

    it('should disable pagination', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      const callArgs = mockedAxios.get.mock.calls[0][0]
      expect(callArgs).toContain('pagination=false')
    })
  })

  describe('Service Type Specific Tests', () => {
    it('should use service_types endpoint', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/service_types')
      )
    })

    it('should sort by name in ascending order', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceTypeAPI.findAll()

      const callArgs = mockedAxios.get.mock.calls[0][0]
      expect(callArgs).toContain('orderBy[name]=asc')
    })
  })

  describe('Error Scenarios', () => {
    it('should propagate axios errors', async () => {
      const networkError = new Error('Network Error')
      networkError.name = 'AxiosError'

      mockedAxios.get.mockRejectedValue(networkError)

      await expect(serviceTypeAPI.findAll()).rejects.toThrow('Network Error')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('Server Error')
      mockedAxios.get.mockRejectedValue(serverError)

      await expect(serviceTypeAPI.findAll()).rejects.toThrow('Server Error')
    })
  })
})