import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import NavBar from './NavBar.vue'

// Mock the router
const routes = [
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('NavBar.vue', () => {
  const vuetify = createVuetify()

  const wrapper = mount(NavBar, {
    global: {
      plugins: [vuetify, router],
    },
  })

  it('renders the application title', () => {
    const title = wrapper.find('.v-toolbar-title')
    expect(title.text()).toBe('Test App Title')
  })

  it('renders navigation buttons for each route', () => {
    const buttons = wrapper.findAll('.v-btn')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('home')
    expect(buttons[1].text()).toBe('about')
  })

  it('has correct links for navigation buttons', () => {
    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    expect(buttons[0].props('to')).toBe('/')
    expect(buttons[1].props('to')).toBe('/about')
  })
})
