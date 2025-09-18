import axios from '@/plugins/axios/axios'
import lead from './lead'

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

describe('Lead API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addLeadComment', () => {
    it('should create FormData and post lead comment with attachments', async () => {
      const mockResponse = { data: { id: 1, comment: 'Test comment' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const mockFile1 = new File(['content1'], 'file1.txt', { type: 'text/plain' })
      const mockFile2 = new File(['content2'], 'file2.txt', { type: 'text/plain' })

      const payload = {
        lead: '/api/leads/1',
        comment: 'Test comment',
        attachedFiles: [mockFile1, mockFile2]
      }

      const result = await lead.addLeadComment(payload)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/lead_comments',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should create FormData and post lead comment without attachments', async () => {
      const mockResponse = { data: { id: 1, comment: 'Test comment' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const payload = {
        lead: '/api/leads/1',
        comment: 'Test comment',
        attachedFiles: []
      }

      const result = await lead.addLeadComment(payload)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/lead_comments',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when adding lead comment', async () => {
      const mockError = new Error('Upload failed')
      mockedAxios.post.mockRejectedValue(mockError)

      const payload = {
        lead: '/api/leads/1',
        comment: 'Test comment',
        attachedFiles: []
      }

      await expect(lead.addLeadComment(payload)).rejects.toThrow('Upload failed')
    })
  })

  describe('findItemsByType', () => {
    it('should call GET with leadType filter', async () => {
      const mockResponse = {
        data: {
          member: [
            { id: 1, name: 'Lead 1', leadType: { id: 5 } }
          ]
        }
      }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await lead.findItemsByType(5)

      expect(mockedAxios.get).toHaveBeenCalledWith('/leads?leadType.id=5')
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when finding leads by type', async () => {
      const mockError = new Error('Network error')
      mockedAxios.get.mockRejectedValue(mockError)

      await expect(lead.findItemsByType(5)).rejects.toThrow('Network error')
    })
  })

  describe('transformIntoProspect', () => {
    it('should call PATCH to transform lead into prospect', async () => {
      const mockResponse = { data: { id: 1, status: 'prospect' } }
      mockedAxios.patch.mockResolvedValue(mockResponse)

      const leadItem = { id: 1, name: 'Test Lead', status: 'lead' }

      const result = await lead.transformIntoProspect(leadItem)

      expect(mockedAxios.patch).toHaveBeenCalledWith('/leads/transform_into_prospect/1', leadItem)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when transforming lead', async () => {
      const mockError = new Error('Transformation failed')
      mockedAxios.patch.mockRejectedValue(mockError)

      const leadItem = { id: 1, name: 'Test Lead', status: 'lead' }

      await expect(lead.transformIntoProspect(leadItem)).rejects.toThrow('Transformation failed')
    })
  })

  it('should have baseUrl property', () => {
    expect(lead.baseUrl).toBe('/leads')
  })

  it('should inherit base API methods', () => {
    expect(typeof lead.findAll).toBe('function')
    expect(typeof lead.find).toBe('function')
    expect(typeof lead.delete).toBe('function')
    expect(typeof lead.save).toBe('function')
    expect(typeof lead.add).toBe('function')
    expect(typeof lead.findPage).toBe('function')
  })
})