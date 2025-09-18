import leadRefusalReason from './leadRefusalReason'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Lead Refusal Reason API', () => {
  it('should have correct baseUrl', () => {
    expect(leadRefusalReason.baseUrl).toBe('/lead_refusal_reasons')
  })

  it('should inherit all base API methods', () => {
    expect(typeof leadRefusalReason.findAll).toBe('function')
    expect(typeof leadRefusalReason.find).toBe('function')
    expect(typeof leadRefusalReason.delete).toBe('function')
    expect(typeof leadRefusalReason.save).toBe('function')
    expect(typeof leadRefusalReason.add).toBe('function')
    expect(typeof leadRefusalReason.findPage).toBe('function')
  })
})