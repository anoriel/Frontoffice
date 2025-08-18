import router from './index'

describe('Router', () => {
  it('has the correct number of routes', () => {
    expect(router.options.routes).toHaveLength(2)
  })

  describe('Home Route', () => {
    const homeRoute = router.options.routes.find((r) => r.name === 'home')

    it('has the correct path', () => {
      expect(homeRoute?.path).toBe('/')
    })

    it('has the correct name', () => {
      expect(homeRoute?.name).toBe('home')
    })

    it('has a component defined', () => {
      expect(homeRoute?.component).toBeDefined()
    })
  })

  describe('About Route', () => {
    const aboutRoute = router.options.routes.find((r) => r.name === 'about')

    it('has the correct path', () => {
      expect(aboutRoute?.path).toBe('/about')
    })

    it('has the correct name', () => {
      expect(aboutRoute?.name).toBe('about')
    })

    it('has a component defined', () => {
      expect(aboutRoute?.component).toBeDefined()
    })
  })
})
