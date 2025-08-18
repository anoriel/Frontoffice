import NavBar from './NavBar.vue'

describe('NavBar.vue', () => {
  it('is a Vue component', () => {
    expect(NavBar).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof NavBar).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(NavBar).not.toBeNull()
  })
})