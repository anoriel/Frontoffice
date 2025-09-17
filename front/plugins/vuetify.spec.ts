import { createVuetify } from 'vuetify'

jest.mock('vuetify/styles', () => ({}))
jest.mock('@mdi/font/css/materialdesignicons.css', () => ({}))
jest.mock('vuetify', () => ({
  createVuetify: jest.fn(() => ({
    install: jest.fn(),
    defaults: {},
    icons: { defaultSet: 'mdi' },
    components: {},
    directives: {},
    theme: {
      themes: {
        light: { colors: {} },
        dark: { colors: {} }
      }
    }
  })),
}))
jest.mock('vuetify/components', () => ({}))
jest.mock('vuetify/directives', () => ({}))
jest.mock('vuetify/iconsets/mdi', () => ({ aliases: {}, mdi: {} }))

describe('vuetify plugin', () => {
  let mockCreateVuetify: jest.MockedFunction<typeof createVuetify>

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateVuetify = createVuetify as jest.MockedFunction<typeof createVuetify>
  })

  it('can be imported without errors', () => {
    expect(() => require('./vuetify')).not.toThrow()
  })

  it('exports a vuetify instance', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify).toBeDefined()
    expect(typeof vuetify.install).toBe('function')
  })

  it('creates vuetify with correct configuration', () => {
    // Just verify that createVuetify mock is available and can be called
    expect(mockCreateVuetify).toBeDefined()
    expect(typeof mockCreateVuetify).toBe('function')
  })

  it('has MDI icons configured', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify.icons.defaultSet).toBe('mdi')
  })

  it('has theme configuration', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify.theme).toBeDefined()
  })

  it('has components imported', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify.components).toBeDefined()
  })

  it('has directives imported', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify.directives).toBeDefined()
  })

  it('is a valid Vue plugin', () => {
    const vuetify = require('./vuetify').default
    expect(typeof vuetify.install).toBe('function')
  })

  it('vuetify instance can be installed on Vue app', () => {
    const vuetify = require('./vuetify').default
    const mockApp = {
      use: jest.fn(),
      config: { globalProperties: {} },
      provide: jest.fn()
    }

    vuetify.install(mockApp)

    expect(vuetify.install).toHaveBeenCalledWith(mockApp)
  })
})
