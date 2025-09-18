import serviceDomainAPI from './serviceDomain'
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

describe('Service Domain API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('API Structure', () => {
    it('should have correct baseUrl', () => {
      expect(serviceDomainAPI.baseUrl).toBe('/service_domains')
    })

    it('should inherit all base API methods', () => {
      expect(typeof serviceDomainAPI.findAll).toBe('function')
      expect(typeof serviceDomainAPI.find).toBe('function')
      expect(typeof serviceDomainAPI.delete).toBe('function')
      expect(typeof serviceDomainAPI.save).toBe('function')
      expect(typeof serviceDomainAPI.add).toBe('function')
      expect(typeof serviceDomainAPI.findPage).toBe('function')
    })
  })

  describe('findAll method', () => {
    it('should call axios with correct URL and parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceDomainAPI.findAll()

      expect(mockedAxios.get).toHaveBeenCalledWith('/service_domains?orderBy[name]=asc&pagination=false')
    })

    it('should return response from axios', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Test Domain' }
          ],
          totalItems: 1
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await serviceDomainAPI.findAll()

      expect(result).toEqual(mockResponse)
    })

    it('should handle errors properly', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(serviceDomainAPI.findAll()).rejects.toThrow('Network error')
    })
  })

  describe('API Integration', () => {
    it('should merge base API with custom implementation', () => {
      expect(serviceDomainAPI).toBeDefined()
      expect(serviceDomainAPI.baseUrl).toBe('/service_domains')
    })

    it('should override base findAll with custom implementation', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceDomainAPI.findAll()

      // Should use custom implementation, not base implementation
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  describe('URL Construction', () => {
    it('should construct correct URL with query parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceDomainAPI.findAll()

      const expectedUrl = '/service_domains?orderBy[name]=asc&pagination=false'
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('should include sorting parameters', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceDomainAPI.findAll()

      const callArgs = mockedAxios.get.mock.calls[0][0]
      expect(callArgs).toContain('orderBy[name]=asc')
    })

    it('should disable pagination', async () => {
      const mockResponse = { data: { member: [], totalItems: 0 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await serviceDomainAPI.findAll()

      const callArgs = mockedAxios.get.mock.calls[0][0]
      expect(callArgs).toContain('pagination=false')
    })
  })
})