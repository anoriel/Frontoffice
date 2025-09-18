import serviceDomain from './serviceDomain'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Service Domain API', () => {
  it('should have correct baseUrl', () => {
    expect(serviceDomain.baseUrl).toBe('/service_domains')
  })

  it('should inherit all base API methods', () => {
    expect(typeof serviceDomain.findAll).toBe('function')
    expect(typeof serviceDomain.find).toBe('function')
    expect(typeof serviceDomain.delete).toBe('function')
    expect(typeof serviceDomain.save).toBe('function')
    expect(typeof serviceDomain.add).toBe('function')
    expect(typeof serviceDomain.findPage).toBe('function')
  })
})