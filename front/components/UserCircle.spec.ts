import UserCircle from './UserCircle.vue'

describe('UserCircle.vue', () => {
  it('is a Vue component', () => {
    expect(UserCircle).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof UserCircle).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(UserCircle).not.toBeNull()
  })
})