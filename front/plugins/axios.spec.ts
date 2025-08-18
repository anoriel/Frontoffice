jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('axios plugin', () => {
  let axiosPlugin: any
  let mockApp: any

  beforeEach(() => {
    jest.clearAllMocks()
    axiosPlugin = require('./axios').default
    mockApp = {
      config: {
        globalProperties: {},
      },
    }
  })

  it('has install method', () => {
    expect(typeof axiosPlugin.install).toBe('function')
  })

  it('installs axios instance on app', () => {
    axiosPlugin.install(mockApp)
    
    expect(mockApp.config.globalProperties.$axios).toBeDefined()
  })

  it('is a valid Vue plugin', () => {
    expect(axiosPlugin.install).toBeDefined()
    expect(typeof axiosPlugin.install).toBe('function')
  })
})