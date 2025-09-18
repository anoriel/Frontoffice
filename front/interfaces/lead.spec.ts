import type { Lead } from './lead'

describe('Lead Interface', () => {
  describe('Type Structure', () => {
    it('should allow lead object with minimal properties', () => {
      const lead: Lead = {
        id: 1
      }

      expect(lead.id).toBe(1)
    })

    it('should allow lead object with all optional properties', () => {
      const lead: Lead = {
        id: 1,
        createdAt: new Date('2024-01-01'),
        customerName: 'Acme Corp',
        name: 'Doe',
        firstname: 'John',
        tel: '+33123456789',
        email: 'john.doe@acme.com',
        priority: 3,
        annualExpectedIncome: 50000,
        incomeProbability: 75,
        customer: { id: 1, nomSociete: 'Acme Corp' },
        countryOfEstablishment: { id: 1, nom: 'France' },
        countryOfDestination: { id: 2, nom: 'Germany' },
        serviceType: { id: 1, name: 'Consulting' },
        serviceDomain: { id: 1, name: 'IT Services' },
        needsDescription: 'Need help with digital transformation',
        onNewsletterList: true,
        rgpdAccepted: true,
        businessSector: { id: 1, name: 'Technology' },
        leadType: { id: 1, name: 'Inbound' },
        user: { id: 1, nom: 'Sales Rep' },
        refusalReasons: [],
        agency: { id: 1, nom: 'Paris Office' },
        society: { id: 1, nom: 'Main Society' },
        leadComments: [{ id: 1, comment: 'Initial contact' }],
        origin: { id: 1, name: 'Website' },
        address1: '123 Main Street',
        address2: 'Suite 456',
        city: 'Paris',
        zipCode: '75001',
        registrationNumber: '123456789',
        vatNumber: 'FR12345678901',
        lastUpdatedAt: new Date('2024-01-15'),
        monthlyExpectedIncome: 5000,
        punctualExpectedIncome: 10000,
        reminderDate: new Date('2024-02-01'),
        leadHistories: [{ id: 1, action: 'Created' }]
      }

      expect(lead.customerName).toBe('Acme Corp')
      expect(lead.name).toBe('Doe')
      expect(lead.firstname).toBe('John')
      expect(lead.email).toBe('john.doe@acme.com')
      expect(lead.priority).toBe(3)
      expect(lead.annualExpectedIncome).toBe(50000)
      expect(lead.incomeProbability).toBe(75)
      expect(lead.onNewsletterList).toBe(true)
      expect(lead.rgpdAccepted).toBe(true)
      expect(lead.needsDescription).toBe('Need help with digital transformation')
    })

    it('should work without optional properties', () => {
      const lead: Lead = {
        id: 1
      }

      expect(lead.createdAt).toBeUndefined()
      expect(lead.customerName).toBeUndefined()
      expect(lead.name).toBeUndefined()
      expect(lead.firstname).toBeUndefined()
      expect(lead.tel).toBeUndefined()
      expect(lead.email).toBeUndefined()
      expect(lead.priority).toBeUndefined()
      expect(lead.annualExpectedIncome).toBeUndefined()
      expect(lead.incomeProbability).toBeUndefined()
      expect(lead.onNewsletterList).toBeUndefined()
      expect(lead.rgpdAccepted).toBeUndefined()
    })
  })

  describe('Property Types', () => {
    it('should have correct basic contact types', () => {
      const lead: Lead = {
        id: 1,
        customerName: 'Test Company',
        name: 'Smith',
        firstname: 'Jane',
        tel: '+33987654321',
        email: 'jane.smith@test.com'
      }

      expect(typeof lead.customerName).toBe('string')
      expect(typeof lead.name).toBe('string')
      expect(typeof lead.firstname).toBe('string')
      expect(typeof lead.tel).toBe('string')
      expect(typeof lead.email).toBe('string')
    })

    it('should have correct numeric types', () => {
      const lead: Lead = {
        id: 1,
        priority: 5,
        annualExpectedIncome: 100000,
        incomeProbability: 85,
        monthlyExpectedIncome: 8000,
        punctualExpectedIncome: 15000
      }

      expect(typeof lead.priority).toBe('number')
      expect(typeof lead.annualExpectedIncome).toBe('number')
      expect(typeof lead.incomeProbability).toBe('number')
      expect(typeof lead.monthlyExpectedIncome).toBe('number')
      expect(typeof lead.punctualExpectedIncome).toBe('number')
    })

    it('should have correct boolean types', () => {
      const lead: Lead = {
        id: 1,
        onNewsletterList: true,
        rgpdAccepted: false
      }

      expect(typeof lead.onNewsletterList).toBe('boolean')
      expect(typeof lead.rgpdAccepted).toBe('boolean')
    })

    it('should have correct date types', () => {
      const lead: Lead = {
        id: 1,
        createdAt: new Date('2024-01-01'),
        lastUpdatedAt: new Date('2024-01-15'),
        reminderDate: new Date('2024-02-01')
      }

      expect(lead.createdAt).toBeInstanceOf(Date)
      expect(lead.lastUpdatedAt).toBeInstanceOf(Date)
      expect(lead.reminderDate).toBeInstanceOf(Date)
    })

    it('should have correct address types', () => {
      const lead: Lead = {
        id: 1,
        address1: '456 Business Ave',
        address2: 'Floor 3',
        city: 'Lyon',
        zipCode: '69001',
        registrationNumber: 'REG123456',
        vatNumber: 'FR98765432109'
      }

      expect(typeof lead.address1).toBe('string')
      expect(typeof lead.address2).toBe('string')
      expect(typeof lead.city).toBe('string')
      expect(typeof lead.zipCode).toBe('string')
      expect(typeof lead.registrationNumber).toBe('string')
      expect(typeof lead.vatNumber).toBe('string')
    })

    it('should allow any type for relationship properties', () => {
      const lead: Lead = {
        id: 1,
        customer: { id: 1, name: 'Customer' },
        countryOfEstablishment: 'France',
        countryOfDestination: null,
        serviceType: 123,
        serviceDomain: { id: 1, name: 'Domain' },
        businessSector: [],
        leadType: 'Inbound',
        user: { id: 1, name: 'User' },
        refusalReasons: null,
        agency: 'Paris',
        society: { id: 1, nom: 'Society' },
        leadComments: [],
        origin: { source: 'website' }
      }

      expect(typeof lead.customer).toBe('object')
      expect(typeof lead.countryOfEstablishment).toBe('string')
      expect(lead.countryOfDestination).toBeNull()
      expect(typeof lead.serviceType).toBe('number')
      expect(typeof lead.serviceDomain).toBe('object')
      expect(Array.isArray(lead.businessSector)).toBe(true)
      expect(typeof lead.leadType).toBe('string')
    })

    it('should have readonly leadHistories property', () => {
      const lead: Lead = {
        id: 1,
        leadHistories: [{ id: 1, action: 'Created', date: new Date() }]
      }

      expect(Array.isArray(lead.leadHistories)).toBe(true)
      expect(lead.leadHistories[0].action).toBe('Created')
    })
  })

  describe('Interface Extension', () => {
    it('should extend Item interface', () => {
      const lead: Lead = {
        id: 1,
        "@id": '/api/leads/1'
      }

      // Should have id property from Item interface
      expect(lead.id).toBeDefined()
      expect(typeof lead.id).toBe('number')
      expect(lead["@id"]).toBe('/api/leads/1')
    })

    it('should support index signature for additional properties', () => {
      const lead: Lead = {
        id: 1,
        customField1: 'custom value',
        customField2: 123,
        customField3: { nested: 'object' }
      }

      expect(lead.customField1).toBe('custom value')
      expect(lead.customField2).toBe(123)
      expect(lead.customField3.nested).toBe('object')
    })
  })

  describe('Real-world Usage', () => {
    it('should work with lead list', () => {
      const leads: Lead[] = [
        {
          id: 1,
          customerName: 'Tech Startup',
          email: 'contact@techstartup.com',
          priority: 4,
          annualExpectedIncome: 25000,
          incomeProbability: 60
        },
        {
          id: 2,
          customerName: 'Enterprise Corp',
          name: 'Johnson',
          firstname: 'Mike',
          priority: 5,
          annualExpectedIncome: 200000,
          incomeProbability: 90
        },
        {
          id: 3,
          customerName: 'SME Business',
          tel: '+33444555666',
          priority: 2,
          rgpdAccepted: true,
          onNewsletterList: false
        }
      ]

      expect(leads.length).toBe(3)
      expect(leads[0].customerName).toBe('Tech Startup')
      expect(leads[1].firstname).toBe('Mike')
      expect(leads[2].rgpdAccepted).toBe(true)
    })

    it('should work with partial lead data', () => {
      const partialLead: Partial<Lead> = {
        customerName: 'Incomplete Lead',
        email: 'partial@lead.com',
        priority: 3
      }

      expect(partialLead.customerName).toBe('Incomplete Lead')
      expect(partialLead.email).toBe('partial@lead.com')
      expect(partialLead.priority).toBe(3)
      expect(partialLead.id).toBeUndefined()
    })

    it('should work with lead creation payload', () => {
      const newLead: Omit<Lead, 'id' | 'createdAt' | 'lastUpdatedAt' | 'leadHistories'> = {
        customerName: 'New Prospect Ltd',
        name: 'Brown',
        firstname: 'Sarah',
        email: 'sarah.brown@newprospect.com',
        tel: '+33777888999',
        priority: 4,
        annualExpectedIncome: 75000,
        incomeProbability: 70,
        needsDescription: 'Looking for cloud migration services',
        onNewsletterList: true,
        rgpdAccepted: true,
        serviceType: { id: 2, name: 'Cloud Services' },
        serviceDomain: { id: 3, name: 'Infrastructure' },
        businessSector: { id: 2, name: 'Finance' },
        reminderDate: new Date('2024-03-01')
      }

      expect(newLead.customerName).toBe('New Prospect Ltd')
      expect(newLead.email).toBe('sarah.brown@newprospect.com')
      expect(newLead.priority).toBe(4)
      expect(newLead.annualExpectedIncome).toBe(75000)
      expect(newLead.reminderDate).toBeInstanceOf(Date)
    })

    it('should work with lead update payload', () => {
      const leadUpdate: Partial<Pick<Lead, 'priority' | 'incomeProbability' | 'needsDescription' | 'reminderDate'>> = {
        priority: 5,
        incomeProbability: 85,
        needsDescription: 'Updated requirements after initial meeting',
        reminderDate: new Date('2024-02-15')
      }

      expect(leadUpdate.priority).toBe(5)
      expect(leadUpdate.incomeProbability).toBe(85)
      expect(leadUpdate.needsDescription).toBe('Updated requirements after initial meeting')
      expect(leadUpdate.reminderDate).toBeInstanceOf(Date)
    })
  })

  describe('Business Logic Properties', () => {
    it('should handle lead scoring and prioritization', () => {
      const highPriorityLead: Lead = {
        id: 1,
        priority: 5,
        annualExpectedIncome: 500000,
        incomeProbability: 95,
        monthlyExpectedIncome: 40000,
        punctualExpectedIncome: 100000
      }

      expect(highPriorityLead.priority).toBe(5)
      expect(highPriorityLead.annualExpectedIncome).toBe(500000)
      expect(highPriorityLead.incomeProbability).toBe(95)
    })

    it('should handle compliance and privacy', () => {
      const compliantLead: Lead = {
        id: 1,
        onNewsletterList: true,
        rgpdAccepted: true,
        needsDescription: 'GDPR compliant data processing solution needed'
      }

      expect(compliantLead.onNewsletterList).toBe(true)
      expect(compliantLead.rgpdAccepted).toBe(true)
    })

    it('should handle geographic information', () => {
      const internationalLead: Lead = {
        id: 1,
        countryOfEstablishment: { id: 1, nom: 'France', code: 'FR' },
        countryOfDestination: { id: 2, nom: 'Spain', code: 'ES' },
        address1: '789 International Blvd',
        city: 'Madrid',
        zipCode: '28001'
      }

      expect(internationalLead.countryOfEstablishment.code).toBe('FR')
      expect(internationalLead.countryOfDestination.code).toBe('ES')
      expect(internationalLead.city).toBe('Madrid')
    })

    it('should handle service categorization', () => {
      const categorizedLead: Lead = {
        id: 1,
        serviceType: { id: 1, name: 'Consulting', category: 'Professional Services' },
        serviceDomain: { id: 2, name: 'Digital Transformation', sector: 'Technology' },
        businessSector: { id: 3, name: 'Healthcare', industry: 'Medical' }
      }

      expect(categorizedLead.serviceType.name).toBe('Consulting')
      expect(categorizedLead.serviceDomain.name).toBe('Digital Transformation')
      expect(categorizedLead.businessSector.name).toBe('Healthcare')
    })

    it('should handle lead tracking and history', () => {
      const trackedLead: Lead = {
        id: 1,
        createdAt: new Date('2024-01-01'),
        lastUpdatedAt: new Date('2024-01-15'),
        reminderDate: new Date('2024-02-01'),
        leadComments: [
          { id: 1, comment: 'Initial contact made', date: '2024-01-01' },
          { id: 2, comment: 'Follow-up scheduled', date: '2024-01-15' }
        ],
        leadHistories: [
          { id: 1, action: 'Created', timestamp: '2024-01-01T10:00:00Z' },
          { id: 2, action: 'Updated', timestamp: '2024-01-15T14:30:00Z' }
        ]
      }

      expect(trackedLead.createdAt).toBeInstanceOf(Date)
      expect(trackedLead.leadComments).toHaveLength(2)
      expect(trackedLead.leadHistories).toHaveLength(2)
      expect(trackedLead.leadComments[1].comment).toBe('Follow-up scheduled')
    })

    it('should handle assignment and ownership', () => {
      const assignedLead: Lead = {
        id: 1,
        user: { id: 5, nom: 'John Sales', email: 'john@company.com', role: 'Sales Manager' },
        agency: { id: 2, nom: 'Regional Office', city: 'Lyon', country: 'France' },
        society: { id: 1, nom: 'Parent Company', type: 'Headquarters' }
      }

      expect(assignedLead.user.role).toBe('Sales Manager')
      expect(assignedLead.agency.city).toBe('Lyon')
      expect(assignedLead.society.type).toBe('Headquarters')
    })
  })
})