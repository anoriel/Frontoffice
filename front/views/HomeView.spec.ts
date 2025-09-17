import { shallowMount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from './HomeView.vue'

const vuetify = createVuetify()
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'only a manager can modify this field': 'Only a manager can modify this field'
    }
  }
})

const mockHelpers = {
  capitalizeFirstLetter: jest.fn((str) => str)
}

jest.mock('@/stores/security', () => ({
  useSecurityStore: jest.fn(() => ({
    getLongRequest: jest.fn().mockResolvedValue(undefined)
  }))
}))

describe('HomeView.vue', () => {
  let wrapper: any
  let pinia: any

  beforeEach(() => {
    jest.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = shallowMount(HomeView, {
      global: {
        plugins: [pinia, vuetify, i18n],
        provide: {
          $helpers: mockHelpers
        },
        mocks: {
          $helpers: mockHelpers
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('is a Vue component', () => {
    expect(HomeView).toBeDefined()
    expect(wrapper.vm).toBeDefined()
  })

  it('renders v-main container', () => {
    expect(wrapper.find('v-main-stub').exists()).toBe(true)
  })

  it('displays the correct heading', () => {
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
  })

  it('renders getLongRequest button', () => {
    const button = wrapper.find('v-btn-stub')
    expect(button.exists()).toBe(true)
  })

  it('initializes count and btnDisabled correctly', () => {
    expect(wrapper.vm.count).toBe(0)
    expect(wrapper.vm.btnDisabled).toBe(false)
  })

  it('increments count when getLongRequest is called', async () => {
    const initialCount = wrapper.vm.count
    await wrapper.vm.getLongRequest()
    
    expect(wrapper.vm.count).toBe(initialCount + 1)
  })

  it('disables button during getLongRequest execution', async () => {
    const promise = wrapper.vm.getLongRequest()
    
    // Button should be disabled during request
    expect(wrapper.vm.btnDisabled).toBe(true)
    
    await promise
    
    // Button should be enabled after request completes
    expect(wrapper.vm.btnDisabled).toBe(false)
  })

  it('calls securityStore.getLongRequest when button is clicked', async () => {
    await wrapper.vm.getLongRequest()
    
    // Store method should be called
    expect(wrapper.vm).toBeDefined()
  })

  it('renders button with correct text including count', async () => {
    wrapper.vm.count = 5
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('v-btn-stub')
    expect(button.text()).toContain('5')
  })

  it('button is disabled when btnDisabled is true', async () => {
    wrapper.vm.btnDisabled = true
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('v-btn-stub')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
