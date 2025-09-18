import type { BusinessSector } from './businesssector'

describe('BusinessSector Interface', () => {
  describe('Type Structure', () => {
    it('should allow business sector object with minimal properties', () => {
      const businessSector: BusinessSector = {
        id: 1
      }

      expect(businessSector.id).toBe(1)
    })

    it('should allow business sector object with all optional properties', () => {
      const businessSector: BusinessSector = {
        id: 1,
        name: 'Technology',
        stringValue: 'Technology Sector'
      }

      expect(businessSector.name).toBe('Technology')
      expect(businessSector.stringValue).toBe('Technology Sector')
    })

    it('should work without optional properties', () => {
      const businessSector: BusinessSector = {
        id: 1
      }

      expect(businessSector.name).toBeUndefined()
      expect(businessSector.stringValue).toBeUndefined()
    })
  })

  describe('Property Types', () => {
    it('should have correct name type', () => {
      const businessSector: BusinessSector = {
        id: 1,
        name: 'Healthcare'
      }

      expect(typeof businessSector.name).toBe('string')
    })

    it('should have readonly stringValue property', () => {
      const businessSector: BusinessSector = {
        id: 1,
        stringValue: 'Display Value for Sector'
      }

      expect(typeof businessSector.stringValue).toBe('string')
    })
  })

  describe('Interface Extension', () => {
    it('should extend Item interface', () => {
      const businessSector: BusinessSector = {
        id: 1,
        "@id": '/api/business-sectors/1'
      }

      // Should have id property from Item interface
      expect(businessSector.id).toBeDefined()
      expect(typeof businessSector.id).toBe('number')
      expect(businessSector["@id"]).toBe('/api/business-sectors/1')
    })
  })

  describe('Real-world Usage', () => {
    it('should work with business sector list', () => {
      const businessSectors: BusinessSector[] = [
        {
          id: 1,
          name: 'Technology',
          stringValue: 'Technology - IT & Software'
        },
        {
          id: 2,
          name: 'Healthcare',
          stringValue: 'Healthcare - Medical Services'
        },
        {
          id: 3,
          name: 'Finance',
          stringValue: 'Finance - Banking & Insurance'
        },
        {
          id: 4,
          name: 'Manufacturing',
          stringValue: 'Manufacturing - Industrial Production'
        }
      ]

      expect(businessSectors.length).toBe(4)
      expect(businessSectors[0].name).toBe('Technology')
      expect(businessSectors[1].stringValue).toBe('Healthcare - Medical Services')
      expect(businessSectors[2].name).toBe('Finance')
      expect(businessSectors[3].name).toBe('Manufacturing')
    })

    it('should work with partial business sector data', () => {
      const partialBusinessSector: Partial<BusinessSector> = {
        name: 'Education'
      }

      expect(partialBusinessSector.name).toBe('Education')
      expect(partialBusinessSector.id).toBeUndefined()
      expect(partialBusinessSector.stringValue).toBeUndefined()
    })

    it('should work with business sector creation payload', () => {
      const newBusinessSector: Omit<BusinessSector, 'id' | 'stringValue'> = {
        name: 'Renewable Energy'
      }

      expect(newBusinessSector.name).toBe('Renewable Energy')
    })

    it('should work with business sector update payload', () => {
      const businessSectorUpdate: Partial<Pick<BusinessSector, 'name'>> = {
        name: 'Updated Sector Name'
      }

      expect(businessSectorUpdate.name).toBe('Updated Sector Name')
    })

    it('should work with business sector filtering and sorting', () => {
      const allBusinessSectors: BusinessSector[] = [
        { id: 3, name: 'Retail', stringValue: 'Retail & E-commerce' },
        { id: 1, name: 'Aerospace', stringValue: 'Aerospace & Defense' },
        { id: 4, name: 'Energy', stringValue: 'Energy & Utilities' },
        { id: 2, name: 'Biotechnology', stringValue: 'Biotechnology & Life Sciences' }
      ]

      // Sort by name alphabetically
      const sortedByName = [...allBusinessSectors].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      )

      // Filter sectors starting with 'B'
      const sectorsStartingWithB = allBusinessSectors.filter(sector =>
        sector.name?.startsWith('B')
      )

      expect(sortedByName[0].name).toBe('Aerospace')
      expect(sortedByName[1].name).toBe('Biotechnology')
      expect(sectorsStartingWithB).toHaveLength(1)
      expect(sectorsStartingWithB[0].name).toBe('Biotechnology')
    })

    it('should work with arrays and bulk operations', () => {
      const sectorIds: number[] = [1, 2, 3, 4, 5]
      const sectorNames: string[] = ['Tech', 'Health', 'Finance', 'Retail', 'Energy']

      const businessSectors: BusinessSector[] = sectorIds.map((id, index) => ({
        id,
        name: sectorNames[index],
        stringValue: `${sectorNames[index]} Sector`
      }))

      expect(businessSectors).toHaveLength(5)
      expect(businessSectors[0].id).toBe(1)
      expect(businessSectors[0].name).toBe('Tech')
      expect(businessSectors[4].stringValue).toBe('Energy Sector')
    })
  })

  describe('Business Logic Properties', () => {
    it('should handle different industry categories', () => {
      const primarySector: BusinessSector = {
        id: 1,
        name: 'Agriculture',
        stringValue: 'Agriculture - Primary Sector'
      }

      const secondarySector: BusinessSector = {
        id: 2,
        name: 'Manufacturing',
        stringValue: 'Manufacturing - Secondary Sector'
      }

      const tertiarySector: BusinessSector = {
        id: 3,
        name: 'Services',
        stringValue: 'Services - Tertiary Sector'
      }

      const quaternarySector: BusinessSector = {
        id: 4,
        name: 'Information Technology',
        stringValue: 'Information Technology - Quaternary Sector'
      }

      expect(primarySector.name).toBe('Agriculture')
      expect(secondarySector.stringValue).toContain('Secondary')
      expect(tertiarySector.name).toBe('Services')
      expect(quaternarySector.stringValue).toContain('Quaternary')
    })

    it('should handle sector hierarchies and subcategories', () => {
      const technologySector: BusinessSector = {
        id: 1,
        name: 'Technology',
        stringValue: 'Technology - Software Development, Hardware, AI/ML'
      }

      const healthcareSector: BusinessSector = {
        id: 2,
        name: 'Healthcare',
        stringValue: 'Healthcare - Hospitals, Pharmaceuticals, Medical Devices'
      }

      expect(technologySector.stringValue).toContain('Software Development')
      expect(technologySector.stringValue).toContain('AI/ML')
      expect(healthcareSector.stringValue).toContain('Pharmaceuticals')
      expect(healthcareSector.stringValue).toContain('Medical Devices')
    })

    it('should handle international sector classifications', () => {
      const naicsSector: BusinessSector = {
        id: 1,
        name: 'Professional Services',
        stringValue: 'Professional Services (NAICS: 54)'
      }

      const isicSector: BusinessSector = {
        id: 2,
        name: 'Information and Communication',
        stringValue: 'Information and Communication (ISIC: J)'
      }

      const nacesSector: BusinessSector = {
        id: 3,
        name: 'Financial Services',
        stringValue: 'Financial Services (NACES: K)'
      }

      expect(naicsSector.stringValue).toContain('NAICS: 54')
      expect(isicSector.stringValue).toContain('ISIC: J')
      expect(nacesSector.stringValue).toContain('NACES: K')
    })

    it('should handle display representation variations', () => {
      const shortDisplaySector: BusinessSector = {
        id: 1,
        name: 'Tech',
        stringValue: 'Tech'
      }

      const mediumDisplaySector: BusinessSector = {
        id: 2,
        name: 'Healthcare',
        stringValue: 'Healthcare Industry'
      }

      const longDisplaySector: BusinessSector = {
        id: 3,
        name: 'Aerospace',
        stringValue: 'Aerospace & Defense - Aircraft Manufacturing, Space Technology, Defense Systems'
      }

      expect(shortDisplaySector.stringValue).toBe('Tech')
      expect(mediumDisplaySector.stringValue).toBe('Healthcare Industry')
      expect(longDisplaySector.stringValue.length).toBeGreaterThan(50)
    })

    it('should handle emerging and traditional sectors', () => {
      const emergingSectors: BusinessSector[] = [
        {
          id: 1,
          name: 'Artificial Intelligence',
          stringValue: 'Artificial Intelligence - Machine Learning, Neural Networks'
        },
        {
          id: 2,
          name: 'Blockchain',
          stringValue: 'Blockchain - Cryptocurrency, DeFi, NFTs'
        },
        {
          id: 3,
          name: 'Green Technology',
          stringValue: 'Green Technology - Renewable Energy, Sustainability'
        }
      ]

      const traditionalSectors: BusinessSector[] = [
        {
          id: 4,
          name: 'Construction',
          stringValue: 'Construction - Building, Infrastructure'
        },
        {
          id: 5,
          name: 'Transportation',
          stringValue: 'Transportation - Logistics, Shipping'
        },
        {
          id: 6,
          name: 'Textiles',
          stringValue: 'Textiles - Clothing, Fabrics'
        }
      ]

      expect(emergingSectors[0].name).toBe('Artificial Intelligence')
      expect(emergingSectors[1].stringValue).toContain('Cryptocurrency')
      expect(traditionalSectors[0].name).toBe('Construction')
      expect(traditionalSectors[2].stringValue).toContain('Fabrics')
    })

    it('should handle sector search and matching', () => {
      const businessSectors: BusinessSector[] = [
        { id: 1, name: 'Technology', stringValue: 'Technology Sector' },
        { id: 2, name: 'Healthcare', stringValue: 'Healthcare Sector' },
        { id: 3, name: 'Financial Technology', stringValue: 'FinTech Sector' },
        { id: 4, name: 'Health Technology', stringValue: 'HealthTech Sector' }
      ]

      const techSectors = businessSectors.filter(sector =>
        sector.name?.toLowerCase().includes('technology') ||
        sector.stringValue?.toLowerCase().includes('tech')
      )

      const healthSectors = businessSectors.filter(sector =>
        sector.name?.toLowerCase().includes('health') ||
        sector.stringValue?.toLowerCase().includes('health')
      )

      expect(techSectors).toHaveLength(3) // Technology, Financial Technology, Health Technology
      expect(healthSectors).toHaveLength(2) // Healthcare, Health Technology
    })
  })
})