import axios from '@/plugins/axios/axios'
import crmListSettings from './crmListSettings'

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

describe('CRM List Settings API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findItemsByType', () => {
    it('should call GET with type filter', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Setting 1', type: 'dashboard' },
            { id: 2, name: 'Setting 2', type: 'dashboard' }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await crmListSettings.findItemsByType('dashboard')

      expect(mockedAxios.get).toHaveBeenCalledWith('/crm_list_settings?type=dashboard')
      expect(result).toEqual(mockResponse)
    })

    it('should handle different types', async () => {
      const mockResponse = { data: { member: [] } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await crmListSettings.findItemsByType('leads')

      expect(mockedAxios.get).toHaveBeenCalledWith('/crm_list_settings?type=leads')
    })

    it('should handle errors when fetching items by type', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(crmListSettings.findItemsByType('dashboard')).rejects.toThrow('Network error')
    })
  })

  it('should have correct baseUrl', () => {
    expect(crmListSettings.baseUrl).toBe('/crm_list_settings')
  })

  it('should inherit base API methods', () => {
    expect(typeof crmListSettings.findAll).toBe('function')
    expect(typeof crmListSettings.find).toBe('function')
    expect(typeof crmListSettings.delete).toBe('function')
    expect(typeof crmListSettings.save).toBe('function')
    expect(typeof crmListSettings.add).toBe('function')
    expect(typeof crmListSettings.findPage).toBe('function')
  })
})