import businessSector from './businessSector'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Business Sector API', () => {
  it('should have correct baseUrl', () => {
    expect(businessSector.baseUrl).toBe('/business_sectors')
  })

  it('should inherit all base API methods', () => {
    expect(typeof businessSector.findAll).toBe('function')
    expect(typeof businessSector.find).toBe('function')
    expect(typeof businessSector.delete).toBe('function')
    expect(typeof businessSector.save).toBe('function')
    expect(typeof businessSector.add).toBe('function')
    expect(typeof businessSector.findPage).toBe('function')
  })

  it('should be a merged object with api_base', () => {
    expect(businessSector).toBeDefined()
    expect(typeof businessSector).toBe('object')
  })
})