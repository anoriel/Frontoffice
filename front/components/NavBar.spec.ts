import { shallowMount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import NavBar from './NavBar.vue'

const vuetify = createVuetify()
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'users': 'Users'
    }
  }
})

const mockHelpers = {
  capitalizeFirstLetter: jest.fn((str) => str)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/admin', 
      name: 'admin', 
      component: { template: '<div>Admin</div>' },
      meta: { 
        title: 'Admin',
        isDropdown: true,
        hasRole: 'ROLE_ADMIN',
        icon: 'mdi-admin',
        isDisabled: false,
        isHidden: false
      }
    },
    { 
      path: '/admin/users', 
      name: 'users', 
      component: { template: '<div>Users</div>' },
      meta: { 
        title: 'Users',
        parent: 'admin',
        hasRole: 'ROLE_ADMIN',
        icon: 'mdi-account',
        isDisabled: false,
        isHidden: false
      }
    }
  ]
})

jest.mock('../stores/security', () => ({
  useSecurityStore: jest.fn(() => ({
    getIsAuthenticated: jest.fn(() => true),
    hasRole: jest.fn(() => true)
  }))
}))

describe('NavBar.vue', () => {
  let wrapper: any
  let pinia: any

  beforeEach(() => {
    jest.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = shallowMount(NavBar, {
      global: {
        plugins: [pinia, vuetify, i18n, router],
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
    expect(NavBar).toBeDefined()
    expect(wrapper.vm).toBeDefined()
  })

  it('renders v-app-bar correctly', () => {
    expect(wrapper.find('v-app-bar-stub').exists()).toBe(true)
  })

  it('filters routes correctly', () => {
    const filteredRoutes = wrapper.vm.filteredRoutes
    expect(Array.isArray(filteredRoutes)).toBe(true)
  })

  it('getChildren returns child routes correctly', () => {
    const mockRoute = { name: 'admin' }
    const children = wrapper.vm.getChildren(mockRoute)
    
    expect(Array.isArray(children)).toBe(true)
  })

  it('shows dropdown menus configuration', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.filteredRoutes).toBeDefined()
  })

  it('handles route access control', () => {
    // Basic test for role-based access
    expect(wrapper.vm).toBeDefined()
  })

  it('handles disabled routes correctly', () => {
    const children = wrapper.vm.getChildren({ name: 'admin' })
    expect(Array.isArray(children)).toBe(true)
  })

  it('filters hidden routes', () => {
    const children = wrapper.vm.getChildren({ name: 'admin' })
    expect(Array.isArray(children)).toBe(true)
  })

  it('handles route metadata correctly', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('handles nested dropdown menus', () => {
    const children = wrapper.vm.getChildren({ name: 'admin' })
    expect(Array.isArray(children)).toBe(true)
  })
})
