import axios from '@/plugins/axios/axios'
import society from './society'

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

describe('Society API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAllActive', () => {
    it('should call GET /societes with active filter and country ordering', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Society 1', active: true, pays: { iso3166: 'FR' } },
            { id: 2, name: 'Society 2', active: true, pays: { iso3166: 'DE' } }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await society.findAllActive()

      expect(mockedAxios.get).toHaveBeenCalledWith('/societes?active=true&orderBy[pays.iso3166]=asc&pagination=false')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching active societies', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(society.findAllActive()).rejects.toThrow('Network error')
    })
  })

  it('should have baseUrl property', () => {
    expect(society.baseUrl).toBe('/societes')
  })

  it('should inherit base API methods', () => {
    expect(typeof society.findAll).toBe('function')
    expect(typeof society.find).toBe('function')
    expect(typeof society.delete).toBe('function')
    expect(typeof society.save).toBe('function')
    expect(typeof society.add).toBe('function')
    expect(typeof society.findPage).toBe('function')
  })
})