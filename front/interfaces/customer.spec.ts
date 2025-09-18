import type { Customer } from './customer'

describe('Customer Interface', () => {
  describe('Type Structure', () => {
    it('should allow customer object with minimal properties', () => {
      const customer: Customer = {
        id: 1
      }

      expect(customer.id).toBe(1)
    })

    it('should allow customer object with all optional properties', () => {
      const customer: Customer = {
        id: 1,
        nomSociete: 'Test Company',
        customerType: { id: 1, name: 'Premium' },
        tel: '+33123456789',
        email: 'test@company.com',
        reference: 'REF001',
        dateRelance: new Date('2024-01-15'),
        dateAjout: new Date('2024-01-01'),
        agency: { id: 1, nom: 'Paris Agency' },
        society: { id: 1, nom: 'Main Society' },
        utilisateur: { id: 1, nom: 'John Doe' },
        contacts: [{ id: 1, nom: 'Contact 1' }],
        country: { id: 1, nom: 'France' },
        stringValue: 'Test Company (REF001)'
      }

      expect(customer.nomSociete).toBe('Test Company')
      expect(customer.tel).toBe('+33123456789')
      expect(customer.email).toBe('test@company.com')
      expect(customer.reference).toBe('REF001')
      expect(customer.dateRelance).toEqual(new Date('2024-01-15'))
      expect(customer.dateAjout).toEqual(new Date('2024-01-01'))
      expect(customer.stringValue).toBe('Test Company (REF001)')
    })

    it('should work without optional properties', () => {
      const customer: Customer = {
        id: 1
      }

      expect(customer.nomSociete).toBeUndefined()
      expect(customer.customerType).toBeUndefined()
      expect(customer.tel).toBeUndefined()
      expect(customer.email).toBeUndefined()
      expect(customer.reference).toBeUndefined()
      expect(customer.dateRelance).toBeUndefined()
      expect(customer.dateAjout).toBeUndefined()
      expect(customer.agency).toBeUndefined()
      expect(customer.society).toBeUndefined()
      expect(customer.utilisateur).toBeUndefined()
      expect(customer.contacts).toBeUndefined()
      expect(customer.country).toBeUndefined()
      expect(customer.stringValue).toBeUndefined()
    })
  })

  describe('Property Types', () => {
    it('should have correct nomSociete type', () => {
      const customer: Customer = {
        id: 1,
        nomSociete: 'Company Name'
      }

      expect(typeof customer.nomSociete).toBe('string')
    })

    it('should have correct contact fields types', () => {
      const customer: Customer = {
        id: 1,
        tel: '+33123456789',
        email: 'contact@company.com'
      }

      expect(typeof customer.tel).toBe('string')
      expect(typeof customer.email).toBe('string')
    })

    it('should have correct reference type', () => {
      const customer: Customer = {
        id: 1,
        reference: 'CUST-001'
      }

      expect(typeof customer.reference).toBe('string')
    })

    it('should have correct date types', () => {
      const customer: Customer = {
        id: 1,
        dateRelance: new Date('2024-02-01'),
        dateAjout: new Date('2024-01-01')
      }

      expect(customer.dateRelance).toBeInstanceOf(Date)
      expect(customer.dateAjout).toBeInstanceOf(Date)
    })

    it('should allow any type for relationship properties', () => {
      const customer: Customer = {
        id: 1,
        customerType: { id: 1, name: 'VIP' },
        agency: 'Paris',
        society: null,
        utilisateur: 123,
        contacts: [],
        country: { code: 'FR', name: 'France' }
      }

      expect(typeof customer.customerType).toBe('object')
      expect(typeof customer.agency).toBe('string')
      expect(customer.society).toBeNull()
      expect(typeof customer.utilisateur).toBe('number')
      expect(Array.isArray(customer.contacts)).toBe(true)
      expect(typeof customer.country).toBe('object')
    })

    it('should have readonly stringValue property', () => {
      const customer: Customer = {
        id: 1,
        stringValue: 'Customer Display Name'
      }

      expect(typeof customer.stringValue).toBe('string')
    })
  })

  describe('Interface Extension', () => {
    it('should extend Item interface', () => {
      const customer: Customer = {
        id: 1,
        "@id": '/api/customers/1'
      }

      // Should have id property from Item interface
      expect(customer.id).toBeDefined()
      expect(typeof customer.id).toBe('number')
      expect(customer["@id"]).toBe('/api/customers/1')
    })
  })

  describe('Real-world Usage', () => {
    it('should work with customer list', () => {
      const customers: Customer[] = [
        {
          id: 1,
          nomSociete: 'Tech Corp',
          email: 'contact@techcorp.com',
          customerType: { id: 1, name: 'Premium' }
        },
        {
          id: 2,
          nomSociete: 'Small Business',
          tel: '+33987654321',
          customerType: { id: 2, name: 'Standard' }
        },
        {
          id: 3,
          nomSociete: 'Enterprise Ltd',
          reference: 'ENT-001',
          agency: { id: 1, nom: 'Main Agency' }
        }
      ]

      expect(customers.length).toBe(3)
      expect(customers[0].nomSociete).toBe('Tech Corp')
      expect(customers[1].tel).toBe('+33987654321')
      expect(customers[2].agency?.nom).toBe('Main Agency')
    })

    it('should work with partial customer data', () => {
      const partialCustomer: Partial<Customer> = {
        nomSociete: 'Incomplete Customer',
        email: 'partial@customer.com'
      }

      expect(partialCustomer.nomSociete).toBe('Incomplete Customer')
      expect(partialCustomer.email).toBe('partial@customer.com')
      expect(partialCustomer.id).toBeUndefined()
    })

    it('should work with customer creation payload', () => {
      const newCustomer: Omit<Customer, 'id' | 'stringValue' | 'dateAjout'> = {
        nomSociete: 'New Customer Inc',
        email: 'info@newcustomer.com',
        tel: '+33555123456',
        reference: 'NEW-001',
        customerType: { id: 1, name: 'Standard' },
        agency: { id: 2, nom: 'Secondary Agency' },
        dateRelance: new Date('2024-03-01')
      }

      expect(newCustomer.nomSociete).toBe('New Customer Inc')
      expect(newCustomer.email).toBe('info@newcustomer.com')
      expect(newCustomer.reference).toBe('NEW-001')
      expect(newCustomer.dateRelance).toBeInstanceOf(Date)
    })

    it('should work with customer update payload', () => {
      const customerUpdate: Partial<Pick<Customer, 'nomSociete' | 'email' | 'tel' | 'reference'>> = {
        email: 'updated@customer.com',
        tel: '+33999888777'
      }

      expect(customerUpdate.email).toBe('updated@customer.com')
      expect(customerUpdate.tel).toBe('+33999888777')
      expect(customerUpdate.nomSociete).toBeUndefined()
    })
  })

  describe('Business Logic Properties', () => {
    it('should handle company information correctly', () => {
      const customer: Customer = {
        id: 1,
        nomSociete: 'Business Solutions Ltd',
        reference: 'BSL-2024-001'
      }

      expect(customer.nomSociete).toBe('Business Solutions Ltd')
      expect(customer.reference).toBe('BSL-2024-001')
    })

    it('should handle contact information', () => {
      const customer: Customer = {
        id: 1,
        email: 'contact@business.com',
        tel: '+33140506070'
      }

      expect(customer.email).toBe('contact@business.com')
      expect(customer.tel).toBe('+33140506070')
    })

    it('should handle date tracking', () => {
      const addDate = new Date('2024-01-15')
      const reminderDate = new Date('2024-02-15')

      const customer: Customer = {
        id: 1,
        dateAjout: addDate,
        dateRelance: reminderDate
      }

      expect(customer.dateAjout).toBe(addDate)
      expect(customer.dateRelance).toBe(reminderDate)
    })

    it('should handle relationships', () => {
      const customer: Customer = {
        id: 1,
        customerType: { id: 1, name: 'VIP', description: 'VIP Customer' },
        agency: { id: 2, nom: 'Regional Office', city: 'Lyon' },
        society: { id: 1, nom: 'Parent Company' },
        utilisateur: { id: 5, nom: 'Account Manager', email: 'manager@company.com' },
        contacts: [
          { id: 1, nom: 'Primary Contact', role: 'Manager' },
          { id: 2, nom: 'Secondary Contact', role: 'Assistant' }
        ],
        country: { id: 1, nom: 'France', code: 'FR' }
      }

      expect(customer.customerType.name).toBe('VIP')
      expect(customer.agency.city).toBe('Lyon')
      expect(customer.society.nom).toBe('Parent Company')
      expect(customer.utilisateur.email).toBe('manager@company.com')
      expect(customer.contacts).toHaveLength(2)
      expect(customer.contacts[0].role).toBe('Manager')
      expect(customer.country.code).toBe('FR')
    })

    it('should handle display representation', () => {
      const customer: Customer = {
        id: 1,
        nomSociete: 'Display Customer',
        reference: 'DISP-001',
        stringValue: 'Display Customer (DISP-001)'
      }

      expect(customer.stringValue).toBe('Display Customer (DISP-001)')
    })
  })
})