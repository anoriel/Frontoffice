import serviceType from './serviceType'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Service Type API', () => {
  it('should have correct baseUrl', () => {
    expect(serviceType.baseUrl).toBe('/service_types')
  })

  it('should inherit all base API methods', () => {
    expect(typeof serviceType.findAll).toBe('function')
    expect(typeof serviceType.find).toBe('function')
    expect(typeof serviceType.delete).toBe('function')
    expect(typeof serviceType.save).toBe('function')
    expect(typeof serviceType.add).toBe('function')
    expect(typeof serviceType.findPage).toBe('function')
  })
})