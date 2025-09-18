import leadOrigin from './leadOrigin'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Lead Origin API', () => {
  it('should have correct baseUrl', () => {
    expect(leadOrigin.baseUrl).toBe('/lead_origins')
  })

  it('should inherit all base API methods', () => {
    expect(typeof leadOrigin.findAll).toBe('function')
    expect(typeof leadOrigin.find).toBe('function')
    expect(typeof leadOrigin.delete).toBe('function')
    expect(typeof leadOrigin.save).toBe('function')
    expect(typeof leadOrigin.add).toBe('function')
    expect(typeof leadOrigin.findPage).toBe('function')
  })
})