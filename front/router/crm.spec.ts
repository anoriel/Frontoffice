import crmRoutes from './crm'

// Mock the vue components
jest.mock('../views/crm/lead/AssignmentRule.vue', () => ({ name: 'AssignmentRule' }))
jest.mock('../views/crm/lead/Dashboard.vue', () => ({ name: 'LeadDashboard' }))
jest.mock('../views/crm/lead/LeadPage.vue', () => ({ name: 'LeadPage' }))
jest.mock('../views/crm/lead/OriginsList.vue', () => ({ name: 'OriginsList' }))
jest.mock('../views/crm/lead/ReasonList.vue', () => ({ name: 'ReasonList' }))
jest.mock('../views/template/List.vue', () => ({ name: 'TemplateList' }))

describe('CRM Routes', () => {
  it('should be an array of route objects', () => {
    expect(Array.isArray(crmRoutes)).toBe(true)
    expect(crmRoutes.length).toBeGreaterThan(0)
  })

  describe('CRM Menu Route', () => {
    const crmMenuRoute = crmRoutes.find(route => route.name === 'menu.crm')

    it('should have CRM menu route', () => {
      expect(crmMenuRoute).toBeDefined()
      expect(crmMenuRoute?.path).toBe('/#')
      expect(crmMenuRoute?.meta?.icon).toBe('mdi-face-agent')
      expect(crmMenuRoute?.meta?.isDropdown).toBe(true)
      expect(crmMenuRoute?.meta?.hasRole).toBe('ROLE_CRM')
    })
  })

  describe('Customer Routes', () => {
    const customerListRoute = crmRoutes.find(route => route.name === 'customers.list')

    it('should have customers list route', () => {
      expect(customerListRoute).toBeDefined()
      expect(customerListRoute?.path).toBe('/crm/customer/list')
      expect(customerListRoute?.component).toBeDefined()
      expect(customerListRoute?.meta?.title).toBe('customers.listTitle')
      expect(customerListRoute?.meta?.parent).toBe('menu.crm')
      expect(customerListRoute?.meta?.hasRole).toBe('ROLE_CRM')
    })

    it('should have correct props function for customers', () => {
      const props = customerListRoute?.props as Function
      expect(typeof props).toBe('function')
      expect(props()).toEqual({ componentPath: 'crm', moduleName: 'customers' })
    })
  })

  describe('Lead Routes', () => {
    it('should have lead dashboard route', () => {
      const leadDashboardRoute = crmRoutes.find(route => route.name === 'lead.dashboard')

      expect(leadDashboardRoute).toBeDefined()
      expect(leadDashboardRoute?.path).toBe('/crm/lead')
      expect(leadDashboardRoute?.meta?.title).toBe('lead.dashboardTitle')
      expect(leadDashboardRoute?.meta?.isDisabled).toBe(true)
      expect(leadDashboardRoute?.meta?.hasRole).toBe('ROLE_SUPER_ADMIN')
    })

    it('should have lead list route', () => {
      const leadListRoute = crmRoutes.find(route => route.name === 'lead.list')

      expect(leadListRoute).toBeDefined()
      expect(leadListRoute?.path).toBe('/crm/lead/list')
      expect(leadListRoute?.meta?.title).toBe('lead.listTitle')
      expect(leadListRoute?.meta?.hasRole).toBe('ROLE_CRM')
      expect(leadListRoute?.meta?.isDisabled).toBe(false)
    })

    it('should have correct props for lead list', () => {
      const leadListRoute = crmRoutes.find(route => route.name === 'lead.list')
      const props = leadListRoute?.props as Function
      expect(typeof props).toBe('function')
      expect(props()).toEqual({ componentPath: 'crm', moduleName: 'lead', addItem: true })
    })

    it('should have lead page route with parameter', () => {
      const leadPageRoute = crmRoutes.find(route => route.name === 'lead.page')

      expect(leadPageRoute).toBeDefined()
      expect(leadPageRoute?.path).toBe('/crm/lead/:id')
      expect(leadPageRoute?.meta?.isHidden).toBe(true)
      expect(leadPageRoute?.meta?.title).toBe('lead.page')
    })
  })

  describe('CRM Settings Routes', () => {
    it('should have CRM settings menu route', () => {
      const settingsRoute = crmRoutes.find(route => route.name === 'crm.settings')

      expect(settingsRoute).toBeDefined()
      expect(settingsRoute?.path).toBe('/#')
      expect(settingsRoute?.meta?.isDropdown).toBe(true)
      expect(settingsRoute?.meta?.hasRole).toBe('ROLE_CRM_ADMIN')
      expect(settingsRoute?.meta?.parent).toBe('menu.crm')
    })

    it('should have assignment rules route', () => {
      const assignmentRulesRoute = crmRoutes.find(route => route.name === 'lead.assignmentRulesList')

      expect(assignmentRulesRoute).toBeDefined()
      expect(assignmentRulesRoute?.path).toBe('/crm/lead/settings/assignments')
      expect(assignmentRulesRoute?.meta?.parent).toBe('crm.settings')
      expect(assignmentRulesRoute?.meta?.root).toBe('menu.crm')
      expect(assignmentRulesRoute?.meta?.hasRole).toBe('ROLE_CRM_ADMIN')
    })

    it('should have origins list route', () => {
      const originsRoute = crmRoutes.find(route => route.name === 'lead.originsList')

      expect(originsRoute).toBeDefined()
      expect(originsRoute?.path).toBe('/crm/lead/settings/origin')
      expect(originsRoute?.meta?.title).toBe('lead.originsList')
      expect(originsRoute?.meta?.hasRole).toBe('ROLE_CRM_ADMIN')
    })

    it('should have refusal reasons route', () => {
      const reasonsRoute = crmRoutes.find(route => route.name === 'lead.refusalReasonsList')

      expect(reasonsRoute).toBeDefined()
      expect(reasonsRoute?.path).toBe('/crm/lead/settings/reasons')
      expect(reasonsRoute?.meta?.title).toBe('lead.refusalReasonsList')
      expect(reasonsRoute?.meta?.hasRole).toBe('ROLE_CRM_ADMIN')
    })
  })

  describe('Route Icons', () => {
    it('should have appropriate icons for routes', () => {
      const routesWithIcons = crmRoutes.filter(route => route.meta?.icon)

      expect(routesWithIcons.length).toBeGreaterThan(0)

      routesWithIcons.forEach(route => {
        expect(route.meta?.icon).toMatch(/^mdi-/)
      })
    })
  })

  describe('Role-based Access', () => {
    it('should have role restrictions on all routes', () => {
      const routesWithRoles = crmRoutes.filter(route => route.meta?.hasRole)

      expect(routesWithRoles.length).toBe(crmRoutes.length)
    })

    it('should have valid role names', () => {
      const validRoles = ['ROLE_CRM', 'ROLE_CRM_ADMIN', 'ROLE_SUPER_ADMIN']

      crmRoutes.forEach(route => {
        if (route.meta?.hasRole) {
          expect(validRoles).toContain(route.meta.hasRole)
        }
      })
    })
  })

  describe('Menu Hierarchy', () => {
    it('should have proper parent-child relationships', () => {
      const menuCrmChildren = crmRoutes.filter(route => route.meta?.parent === 'menu.crm')
      const crmSettingsChildren = crmRoutes.filter(route => route.meta?.parent === 'crm.settings')

      expect(menuCrmChildren.length).toBeGreaterThan(0)
      expect(crmSettingsChildren.length).toBeGreaterThan(0)
    })

    it('should have dropdown menus properly configured', () => {
      const dropdownRoutes = crmRoutes.filter(route => route.meta?.isDropdown)

      dropdownRoutes.forEach(route => {
        expect(route.path).toBe('/#')
      })
    })
  })
})