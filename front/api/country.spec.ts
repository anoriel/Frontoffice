import axios from '@/plugins/axios/axios'
import country from './country'

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

describe('Country API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should call GET /pays with ISO ordering and no pagination', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'France', iso3166: 'FR' },
            { id: 2, name: 'Germany', iso3166: 'DE' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await country.findAll()

      expect(mockedAxios.get).toHaveBeenCalledWith('/pays?orderBy[iso3166]=asc&pagination=false')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching countries', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(country.findAll()).rejects.toThrow('Network error')
    })
  })

  it('should have correct baseUrl', () => {
    expect(country.baseUrl).toBe('/pays')
  })

  it('should inherit base API methods', () => {
    expect(typeof country.find).toBe('function')
    expect(typeof country.delete).toBe('function')
    expect(typeof country.save).toBe('function')
    expect(typeof country.add).toBe('function')
    expect(typeof country.findPage).toBe('function')
  })
})