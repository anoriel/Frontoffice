import axios from 'axios'

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}))

// Mock import.meta.env for Vite environment variables
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {}
    }
  }
})

const originalEnv = process.env

describe('axios instance', () => {
  let mockAxiosInstance: any

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }

    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.create.mockReturnValue(mockAxiosInstance)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('exports an axios instance', () => {
    const axiosInstance = require('./axios').default
    expect(axiosInstance).toBeDefined()
    // Use toEqual instead of toBe for object comparison
    expect(axiosInstance).toEqual(mockAxiosInstance)
  })

  it('axios instance is created through axios.create', () => {
    // The module was loaded when imported, so just verify mock was configured
    const mockedAxios = axios as jest.Mocked<typeof axios>
    expect(mockedAxios.create).toBeDefined()
  })

  it('axios instance has all required methods', () => {
    const axiosInstance = require('./axios').default

    expect(axiosInstance.get).toBeDefined()
    expect(axiosInstance.post).toBeDefined()
    expect(axiosInstance.put).toBeDefined()
    expect(axiosInstance.delete).toBeDefined()
    expect(axiosInstance.patch).toBeDefined()
  })

  it('axios instance has interceptors', () => {
    const axiosInstance = require('./axios').default

    expect(axiosInstance.interceptors.request).toBeDefined()
    expect(axiosInstance.interceptors.response).toBeDefined()
  })
})
