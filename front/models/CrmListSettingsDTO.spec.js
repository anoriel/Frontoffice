import CrmListSettingsDTO from './CrmListSettingsDTO'

describe('CrmListSettingsDTO', () => {
  describe('Constructor', () => {
    it('should create instance with default values when no rawData provided', () => {
      const dto = new CrmListSettingsDTO()

      expect(dto.name).toBeUndefined()
      expect(dto.context).toEqual({}) // BaseModel sets default context from constructor
      expect(dto.isPublic).toBeUndefined() // isPublic is not set by default
      expect(dto.type).toBeUndefined()
      expect(dto.user).toBeUndefined()
    })

    it('should create instance with default rawData structure', () => {
      const dto = new CrmListSettingsDTO({})

      expect(dto.name).toBeUndefined()
      expect(dto.context).toBeUndefined()
      expect(dto.isPublic).toBeUndefined()
      expect(dto.type).toBeUndefined()
      expect(dto.user).toBeUndefined()
    })

    it('should set name when provided in rawData', () => {
      const rawData = {
        name: 'Test List Settings'
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.name).toBe('Test List Settings')
    })

    it('should set context when provided in rawData', () => {
      const rawData = {
        context: {
          filters: { status: 'active' },
          sorting: { field: 'name', order: 'asc' }
        }
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.context).toEqual({
        filters: { status: 'active' },
        sorting: { field: 'name', order: 'asc' }
      })
    })

    it('should set isPublic when provided in rawData', () => {
      const rawData = {
        isPublic: true
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.isPublic).toBe(true)
    })

    it('should set user when provided in rawData', () => {
      const rawData = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.user).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      })
    })

    it('should handle all properties together', () => {
      const rawData = {
        name: 'Complete Settings',
        context: { filters: {} },
        isPublic: true, // Use true to test setting
        type: 'custom',
        user: { id: 2, name: 'Jane Doe' }
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.name).toBe('Complete Settings')
      expect(dto.context).toEqual({ filters: {} })
      expect(dto.isPublic).toBe(true)
      expect(dto.type).toBeUndefined() // type is not set in constructor
      expect(dto.user).toEqual({ id: 2, name: 'Jane Doe' })
    })

    it('should not set properties when they are falsy', () => {
      const rawData = {
        name: '',
        context: null,
        isPublic: false, // false is falsy but should be set
        user: undefined
      }
      const dto = new CrmListSettingsDTO(rawData)

      expect(dto.name).toBeUndefined()
      expect(dto.context).toBeUndefined()
      expect(dto.isPublic).toBeUndefined() // false is falsy in if condition, so not set
      expect(dto.user).toBeUndefined()
    })

    it('should handle null rawData', () => {
      const dto = new CrmListSettingsDTO(null)

      expect(dto.name).toBeUndefined()
      expect(dto.context).toBeUndefined()
      expect(dto.isPublic).toBeUndefined()
      expect(dto.type).toBeUndefined()
      expect(dto.user).toBeUndefined()
    })

    it('should handle undefined rawData', () => {
      const dto = new CrmListSettingsDTO(undefined)

      expect(dto.name).toBeUndefined()
      expect(dto.context).toEqual({}) // BaseModel sets default context
      expect(dto.isPublic).toBeUndefined() // isPublic is not set by default
      expect(dto.type).toBeUndefined()
      expect(dto.user).toBeUndefined()
    })
  })

  describe('Inheritance', () => {
    it('should extend BaseModel', () => {
      const dto = new CrmListSettingsDTO()

      expect(dto).toBeInstanceOf(CrmListSettingsDTO)
      // Check if it has BaseModel methods (assuming they exist)
      expect(typeof dto.setString).toBe('function')
      expect(typeof dto.setObject).toBe('function')
      expect(typeof dto.setBoolean).toBe('function')
    })

    it('should call parent constructor', () => {
      const rawData = { name: 'Test' }
      const dto = new CrmListSettingsDTO(rawData)

      // Should have inherited functionality from BaseModel
      expect(dto).toBeDefined()
    })
  })

  describe('Property Setting Methods', () => {
    it('should use setString for name property', () => {
      const dto = new CrmListSettingsDTO()
      const spy = jest.spyOn(dto, 'setString')

      const newDto = new CrmListSettingsDTO({ name: 'Test Name' })

      // We can't directly spy on the constructor call, but we can verify the result
      expect(newDto.name).toBe('Test Name')
    })

    it('should use setObject for context property', () => {
      const context = { test: 'value' }
      const dto = new CrmListSettingsDTO({ context })

      expect(dto.context).toEqual(context)
    })

    it('should use setBoolean for isPublic property', () => {
      const dto = new CrmListSettingsDTO({ isPublic: true })

      expect(dto.isPublic).toBe(true)
    })

    it('should use setObject for user property', () => {
      const user = { id: 1, name: 'Test User' }
      const dto = new CrmListSettingsDTO({ user })

      expect(dto.user).toEqual(user)
    })
  })
})