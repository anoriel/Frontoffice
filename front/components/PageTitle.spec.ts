import PageTitle from './PageTitle.vue'

describe('PageTitle.vue', () => {
  it('is a Vue component', () => {
    expect(PageTitle).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof PageTitle).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(PageTitle).not.toBeNull()
  })
})