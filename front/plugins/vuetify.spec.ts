jest.mock('vuetify/styles', () => ({}))
jest.mock('@mdi/font/css/materialdesignicons.css', () => ({}))
jest.mock('vuetify', () => ({
  createVuetify: jest.fn(() => ({
    install: jest.fn(),
    defaults: {},
    icons: { defaultSet: 'mdi' },
    components: {},
    directives: {},
  })),
}))
jest.mock('vuetify/components', () => ({}))
jest.mock('vuetify/directives', () => ({}))
jest.mock('vuetify/iconsets/mdi', () => ({ aliases: {}, mdi: {} }))

describe('vuetify plugin', () => {
  it('can be imported without errors', () => {
    expect(() => require('./vuetify')).not.toThrow()
  })

  it('exports a vuetify instance', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify).toBeDefined()
    expect(typeof vuetify.install).toBe('function')
  })

  it('has expected structure', () => {
    const vuetify = require('./vuetify').default
    expect(vuetify.icons.defaultSet).toBe('mdi')
  })
})
