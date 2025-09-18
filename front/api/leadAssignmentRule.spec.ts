import leadAssignmentRule from './leadAssignmentRule'

jest.mock('./api_base', () => ({
  baseUrl: '/base',
  findAll: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  add: jest.fn(),
  findPage: jest.fn()
}))

describe('Lead Assignment Rule API', () => {
  it('should have correct baseUrl', () => {
    expect(leadAssignmentRule.baseUrl).toBe('/lead_assignment_rules')
  })

  it('should inherit all base API methods', () => {
    expect(typeof leadAssignmentRule.findAll).toBe('function')
    expect(typeof leadAssignmentRule.find).toBe('function')
    expect(typeof leadAssignmentRule.delete).toBe('function')
    expect(typeof leadAssignmentRule.save).toBe('function')
    expect(typeof leadAssignmentRule.add).toBe('function')
    expect(typeof leadAssignmentRule.findPage).toBe('function')
  })
})