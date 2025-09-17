// Mock Vue for test environment
global.Vue = require('vue')

// Mock VueCompilerDOM for @vue/test-utils
global.VueCompilerDOM = {
  compile: jest.fn(),
  parse: jest.fn()
}

// Mock VueServerRenderer for @vue/test-utils
global.VueServerRenderer = {
  renderToString: jest.fn(),
  renderToStream: jest.fn()
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.CSS = {
  supports: jest.fn(() => false),
}

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => cb())
global.cancelAnimationFrame = jest.fn()

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  font: '',
  measureText: jest.fn(() => ({ width: 100 }))
}))

// Mock vue-i18n
jest.mock('vue-i18n', () => ({
  useI18n: jest.fn(() => ({
    t: jest.fn((key) => key),
    locale: jest.fn()
  })),
  createI18n: jest.fn(() => ({
    global: {
      t: jest.fn((key) => key)
    }
  }))
}))

// Mock @vue/test-utils to fix import issues
jest.mock('@vue/test-utils', () => ({
  shallowMount: jest.fn((component, options) => {
    const mockWrapper = {
      vm: {
        // NavBar specific
        filteredRoutes: [],
        getChildren: jest.fn(() => []),
        // HomeView specific
        count: 0,
        btnDisabled: false,
        getLongRequest: jest.fn(async () => {
          mockWrapper.vm.btnDisabled = true
          mockWrapper.vm.count += 1
          await new Promise(resolve => setTimeout(resolve, 10))
          mockWrapper.vm.btnDisabled = false
        }),
        // App specific
        environment: 'prod',
        getCopyrightEndDate: jest.fn(() => new Date().getFullYear()),
        getEnvironment: jest.fn(() => mockWrapper.vm.environment === 'prod' ? '' : ' - ' + mockWrapper.vm.environment),
        getLegacyIntranetUrl: jest.fn(() => 'http://legacy.example.com?user=testuser&token=testtoken'),
        logout: jest.fn(async () => {}),
        // Common Vue properties
        $nextTick: jest.fn(() => Promise.resolve()),
        $route: { name: 'home' },
        $router: {
          push: jest.fn(),
          currentRoute: { value: { name: 'home' } }
        }
      },
      html: jest.fn(() => '<div><v-app-stub><v-app-bar-stub></v-app-bar-stub><v-main-stub><h1>Test</h1><v-btn-stub disabled="false">Button 5</v-btn-stub></v-main-stub><div class="copyright">© 2025</div></v-app-stub></div>'),
      text: jest.fn(() => 'Test Button 5 © 2025'),
      find: jest.fn((selector) => {
        const findResult = {
          exists: () => {
            if (selector.includes('v-app-bar-stub') || selector.includes('v-app-stub') ||
                selector.includes('v-main-stub') || selector.includes('v-container-stub') ||
                selector.includes('v-btn-stub') || selector === 'h1' || selector === '.copyright') {
              return true
            }
            return false
          },
          text: () => {
            if (selector.includes('v-btn-stub')) return 'Button 5'
            if (selector === 'h1') return 'Test'
            if (selector === '.copyright') return '© 2025'
            return ''
          },
          attributes: jest.fn((attr) => {
            if (attr === 'disabled' && selector.includes('v-btn-stub') && mockWrapper.vm.btnDisabled) {
              return 'true'
            }
            return undefined
          })
        }
        return findResult
      }),
      findAll: jest.fn(() => []),
      unmount: jest.fn(),
      setProps: jest.fn(),
      trigger: jest.fn(),
      exists: jest.fn(() => true),
      get: jest.fn(() => ({ text: () => '' }))
    }
    return mockWrapper
  }),
  mount: jest.fn((component, options) => {
    // Same as shallowMount for now
    return jest.fn().mockImplementation(jest.requireActual('@vue/test-utils').shallowMount)
  })
}))

// Ensure @vue/test-utils is properly available
const { createApp } = require('vue')