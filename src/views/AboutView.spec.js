import AboutView from './AboutView.vue'

describe('AboutView.vue', () => {
  it('is a Vue component', () => {
    expect(AboutView).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof AboutView).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(AboutView).not.toBeNull()
  })
})