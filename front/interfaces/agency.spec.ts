import type { Agency } from './agency'

describe('Agency Interface', () => {
  describe('Type Structure', () => {
    it('should allow agency object with required properties', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Test Agency'
      }

      expect(agency.id).toBe(1)
      expect(agency.nom).toBe('Test Agency')
    })

    it('should allow optional properties', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Test Agency',
        active: true,
        pays: { id: 1, nom: 'France' },
        stringValue: 'Test Agency'
      }

      expect(agency.active).toBe(true)
      expect(agency.pays).toEqual({ id: 1, nom: 'France' })
      expect(agency.stringValue).toBe('Test Agency')
    })

    it('should work without optional properties', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Test Agency'
      }

      expect(agency.active).toBeUndefined()
      expect(agency.pays).toBeUndefined()
      expect(agency.stringValue).toBeUndefined()
    })
  })

  describe('Property Types', () => {
    it('should have correct nom type', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Agency Name'
      }

      expect(typeof agency.nom).toBe('string')
    })

    it('should have correct active type', () => {
      const activeAgency: Agency = {
        id: 1,
        active: true
      }

      const inactiveAgency: Agency = {
        id: 2,
        active: false
      }

      expect(typeof activeAgency.active).toBe('boolean')
      expect(typeof inactiveAgency.active).toBe('boolean')
    })

    it('should allow any type for pays property', () => {
      const agencyWithCountry: Agency = {
        id: 1,
        pays: { id: 1, nom: 'France' }
      }

      const agencyWithString: Agency = {
        id: 2,
        pays: 'France'
      }

      const agencyWithNull: Agency = {
        id: 3,
        pays: null
      }

      expect(typeof agencyWithCountry.pays).toBe('object')
      expect(typeof agencyWithString.pays).toBe('string')
      expect(agencyWithNull.pays).toBeNull()
    })

    it('should have readonly stringValue property', () => {
      const agency: Agency = {
        id: 1,
        stringValue: 'Test Agency Display'
      }

      expect(typeof agency.stringValue).toBe('string')
    })
  })

  describe('Interface Extension', () => {
    it('should extend Item interface', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Test Agency'
      }

      // Should have id property from Item interface
      expect(agency.id).toBeDefined()
      expect(typeof agency.id).toBe('number')
    })
  })

  describe('Real-world Usage', () => {
    it('should work with agency list', () => {
      const agencies: Agency[] = [
        { id: 1, nom: 'Paris Agency', active: true },
        { id: 2, nom: 'Lyon Agency', active: false },
        { id: 3, nom: 'Marseille Agency', active: true, pays: { id: 1, nom: 'France' } }
      ]

      expect(agencies.length).toBe(3)
      expect(agencies[0].nom).toBe('Paris Agency')
      expect(agencies[2].pays?.nom).toBe('France')
    })

    it('should work with partial agency data', () => {
      const partialAgency: Partial<Agency> = {
        nom: 'Incomplete Agency'
      }

      expect(partialAgency.nom).toBe('Incomplete Agency')
      expect(partialAgency.id).toBeUndefined()
    })

    it('should work with agency creation payload', () => {
      const newAgency: Omit<Agency, 'id' | 'stringValue'> = {
        nom: 'New Agency',
        active: true,
        pays: { id: 1, nom: 'France' }
      }

      expect(newAgency.nom).toBe('New Agency')
      expect(newAgency.active).toBe(true)
      expect(newAgency.pays.nom).toBe('France')
    })
  })

  describe('Business Logic Properties', () => {
    it('should handle active status correctly', () => {
      const activeAgency: Agency = {
        id: 1,
        nom: 'Active Agency',
        active: true
      }

      const inactiveAgency: Agency = {
        id: 2,
        nom: 'Inactive Agency',
        active: false
      }

      expect(activeAgency.active).toBe(true)
      expect(inactiveAgency.active).toBe(false)
    })

    it('should handle country relationship', () => {
      const agencyWithCountry: Agency = {
        id: 1,
        nom: 'International Agency',
        pays: {
          id: 1,
          nom: 'France',
          code: 'FR'
        }
      }

      expect(agencyWithCountry.pays).toBeDefined()
      expect(agencyWithCountry.pays.nom).toBe('France')
      expect(agencyWithCountry.pays.code).toBe('FR')
    })

    it('should handle display representation', () => {
      const agency: Agency = {
        id: 1,
        nom: 'Display Agency',
        stringValue: 'Display Agency (Paris)'
      }

      expect(agency.stringValue).toBe('Display Agency (Paris)')
    })
  })
})