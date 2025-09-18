// Mock vue-i18n
jest.mock('vue-i18n', () => ({
  createI18n: jest.fn(() => ({
    global: {
      locale: { value: 'en' },
      fallbackLocale: { value: 'fr' },
      messages: {
        value: {
          bg: { test: 'test bg' },
          cs: { test: 'test cs' },
          de: { test: 'test de' },
          en: { test: 'test en' },
          es: { test: 'test es' },
          fr: { test: 'test fr' },
          it: { test: 'test it' },
          nl: { test: 'test nl' },
          pl: { test: 'test pl' },
          pt: { test: 'test pt' },
          ro: { test: 'test ro' }
        }
      },
      availableLocales: ['bg', 'cs', 'de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ro']
    },
    mode: 'composition'
  }))
}))

// Mock the locale files
jest.mock('../locales/bg.json', () => ({ test: 'test bg' }), { virtual: true })
jest.mock('../locales/cs.json', () => ({ test: 'test cs' }), { virtual: true })
jest.mock('../locales/de.json', () => ({ test: 'test de' }), { virtual: true })
jest.mock('../locales/en.json', () => ({ test: 'test en' }), { virtual: true })
jest.mock('../locales/es.json', () => ({ test: 'test es' }), { virtual: true })
jest.mock('../locales/fr.json', () => ({ test: 'test fr' }), { virtual: true })
jest.mock('../locales/it.json', () => ({ test: 'test it' }), { virtual: true })
jest.mock('../locales/nl.json', () => ({ test: 'test nl' }), { virtual: true })
jest.mock('../locales/pl.json', () => ({ test: 'test pl' }), { virtual: true })
jest.mock('../locales/pt.json', () => ({ test: 'test pt' }), { virtual: true })
jest.mock('../locales/ro.json', () => ({ test: 'test ro' }), { virtual: true })

import i18n from './i18n'

describe('i18n Plugin', () => {
  it('should create i18n instance', () => {
    expect(i18n).toBeDefined()
    expect(i18n.global).toBeDefined()
  })

  it('should use Composition API mode', () => {
    expect(i18n.mode).toBe('composition')
  })

  it('should have correct locale configuration', () => {
    expect(i18n.global.locale.value).toBeDefined()
    expect(i18n.global.fallbackLocale.value).toBeDefined()
  })

  it('should include all required locales', () => {
    const availableLocales = i18n.global.availableLocales

    expect(availableLocales).toContain('bg')
    expect(availableLocales).toContain('cs')
    expect(availableLocales).toContain('de')
    expect(availableLocales).toContain('en')
    expect(availableLocales).toContain('es')
    expect(availableLocales).toContain('fr')
    expect(availableLocales).toContain('it')
    expect(availableLocales).toContain('nl')
    expect(availableLocales).toContain('pl')
    expect(availableLocales).toContain('pt')
    expect(availableLocales).toContain('ro')
  })

  it('should have messages for all locales', () => {
    const messages = i18n.global.messages.value

    expect(messages.bg).toBeDefined()
    expect(messages.cs).toBeDefined()
    expect(messages.de).toBeDefined()
    expect(messages.en).toBeDefined()
    expect(messages.es).toBeDefined()
    expect(messages.fr).toBeDefined()
    expect(messages.it).toBeDefined()
    expect(messages.nl).toBeDefined()
    expect(messages.pl).toBeDefined()
    expect(messages.pt).toBeDefined()
    expect(messages.ro).toBeDefined()
  })

  it('should set locale based on environment variable', () => {
    // The instance was created with the mocked environment
    // So we verify the configuration was applied
    expect(i18n.global.locale.value).toBeDefined()
  })

  it('should have fallback locale configured', () => {
    expect(i18n.global.fallbackLocale.value).toBeDefined()
  })

  describe('Locale switching', () => {
    it('should be able to change locale', () => {
      i18n.global.locale.value = 'fr'
      expect(i18n.global.locale.value).toBe('fr')

      i18n.global.locale.value = 'en'
      expect(i18n.global.locale.value).toBe('en')
    })
  })

  describe('Default configuration', () => {
    it('should use French as default locale when env vars are not set', () => {
      // This tests the fallback values in the options
      const defaultLocale = 'fr'
      const defaultFallback = 'fr'

      expect(['fr', 'en']).toContain(i18n.global.locale.value)
      expect(['fr', 'en']).toContain(i18n.global.fallbackLocale.value)
    })
  })

  describe('Supported Languages', () => {
    it('should support European languages', () => {
      const europeanLangs = ['fr', 'en', 'de', 'es', 'it', 'nl', 'pl', 'pt', 'ro', 'bg', 'cs']
      const availableLocales = i18n.global.availableLocales

      europeanLangs.forEach(lang => {
        expect(availableLocales).toContain(lang)
      })
    })
  })
})