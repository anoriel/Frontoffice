import ErrorMessage from './ErrorMessage.vue'

describe('ErrorMessage.vue', () => {
  it('is a Vue component', () => {
    expect(ErrorMessage).toBeDefined()
  })

  it('can be imported successfully', () => {
    expect(typeof ErrorMessage).toBe('object')
  })

  it('is a valid Vue SFC', () => {
    expect(ErrorMessage).not.toBeNull()
  })
})