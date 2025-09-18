import axios from '@/plugins/axios/axios'
import agency from './agency'

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

describe('Agency API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAllActive', () => {
    it('should call GET /agencies with active filter and country ordering', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Agency 1', actif: true },
            { id: 2, name: 'Agency 2', actif: true }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await agency.findAllActive()

      expect(mockedAxios.get).toHaveBeenCalledWith('/agencies?actif=true&orderBy[pays.iso3166]=asc&pagination=false')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching active agencies', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(agency.findAllActive()).rejects.toThrow('Network error')
    })
  })

  it('should have baseUrl property', () => {
    expect(agency.baseUrl).toBe('/agencies')
  })

  it('should inherit base API methods', () => {
    expect(typeof agency.findAll).toBe('function')
    expect(typeof agency.find).toBe('function')
    expect(typeof agency.delete).toBe('function')
    expect(typeof agency.save).toBe('function')
    expect(typeof agency.add).toBe('function')
    expect(typeof agency.findPage).toBe('function')
  })
})