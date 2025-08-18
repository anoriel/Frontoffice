const mockMount = jest.fn()
const mockUse = jest.fn().mockReturnThis()
const mockApp = {
  use: mockUse,
  mount: mockMount,
}
const mockCreateApp = jest.fn(() => mockApp)
const mockCreatePinia = jest.fn(() => ({ install: jest.fn() }))

jest.mock('vue', () => ({
  createApp: mockCreateApp,
}))

jest.mock('pinia', () => ({
  createPinia: mockCreatePinia,
}))

jest.mock('./App.vue', () => ({
  template: '<div>Mock App</div>',
}))

jest.mock('./router', () => ({
  install: jest.fn(),
  name: 'router',
}))

jest.mock('./plugins/vuetify', () => ({
  install: jest.fn(),
  name: 'vuetify',
}))

jest.mock('./plugins/axios', () => ({
  install: jest.fn(),
  name: 'axios',
}))

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear the module cache to ensure fresh imports
    jest.resetModules()
  })

  it('creates Vue app with App component', () => {
    require('./main.ts')
    
    expect(mockCreateApp).toHaveBeenCalledTimes(1)
    expect(mockCreateApp).toHaveBeenCalledWith(expect.objectContaining({
      template: '<div>Mock App</div>',
    }))
  })

  it('creates and uses Pinia store', () => {
    require('./main.ts')
    
    expect(mockCreatePinia).toHaveBeenCalledTimes(1)
    expect(mockUse).toHaveBeenCalledWith(expect.objectContaining({
      install: expect.any(Function)
    }))
  })

  it('uses all required plugins in correct order', () => {
    require('./main.ts')
    
    expect(mockUse).toHaveBeenCalledTimes(4)
    
    // Check that plugins are used in the expected order
    const calls = mockUse.mock.calls
    expect(calls[0][0]).toEqual(expect.objectContaining({ install: expect.any(Function) })) // Pinia
    expect(calls[1][0]).toEqual(expect.objectContaining({ name: 'router' })) // Router
    expect(calls[2][0]).toEqual(expect.objectContaining({ name: 'vuetify' })) // Vuetify
    expect(calls[3][0]).toEqual(expect.objectContaining({ name: 'axios' })) // Axios
  })

  it('mounts the app to #app element', () => {
    require('./main.ts')
    
    expect(mockMount).toHaveBeenCalledTimes(1)
    expect(mockMount).toHaveBeenCalledWith('#app')
  })

  it('follows the correct initialization sequence', () => {
    require('./main.ts')
    
    // Verify the correct sequence: createApp -> use plugins -> mount
    const createAppCall = mockCreateApp.mock.invocationCallOrder[0]
    const firstUseCall = mockUse.mock.invocationCallOrder[0]
    const mountCall = mockMount.mock.invocationCallOrder[0]
    
    expect(createAppCall).toBeLessThan(firstUseCall)
    expect(firstUseCall).toBeLessThan(mountCall)
  })

  it('creates app instance and configures it properly', () => {
    require('./main.ts')
    
    expect(mockCreateApp).toHaveBeenCalled()
    expect(mockUse).toHaveBeenCalled()
    expect(mockMount).toHaveBeenCalled()
  })
})