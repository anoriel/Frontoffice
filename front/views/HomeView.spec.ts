import HomeView from './HomeView.vue'

describe('HomeView.vue', () => {
  it('is a Vue component', () => {
    expect(HomeView).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof HomeView).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(HomeView).not.toBeNull()
  })
})
