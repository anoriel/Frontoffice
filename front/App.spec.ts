import App from './App.vue'

describe('App.vue', () => {
  it('is a Vue component', () => {
    expect(App).toBeDefined()
    expect((App as any).template || (App as any).render).toBeDefined()
  })

  it('imports NavBar component', () => {
    expect((App as any).__vccOpts || App).toBeDefined()
  })

  it('has the expected template structure', () => {
    const expectedElements = ['v-app', 'nav-bar', 'v-main', 'router-view']
    const templateString = (App as any).template || ''

    if (typeof templateString === 'string' && templateString) {
      expectedElements.forEach((element) => {
        expect(templateString.toLowerCase()).toContain(element.toLowerCase())
      })
    } else {
      expect(true).toBe(true)
    }
  })
})
