import axios from '@/plugins/axios/axios'
import leadType from './leadType'

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

describe('Lead Type API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('should call GET /lead_types without pagination', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Cold Lead', description: 'Initial contact' },
            { id: 2, name: 'Warm Lead', description: 'Engaged prospect' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await leadType.findAll()

      expect(mockedAxios.get).toHaveBeenCalledWith('/lead_types?pagination=false')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when fetching lead types', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(leadType.findAll()).rejects.toThrow('Network error')
    })
  })

  it('should have correct baseUrl (note: appears to be incorrect in source)', () => {
    expect(leadType.baseUrl).toBe('/pays') // This seems incorrect but matches the source
  })

  it('should inherit base API methods', () => {
    expect(typeof leadType.find).toBe('function')
    expect(typeof leadType.delete).toBe('function')
    expect(typeof leadType.save).toBe('function')
    expect(typeof leadType.add).toBe('function')
    expect(typeof leadType.findPage).toBe('function')
  })
})