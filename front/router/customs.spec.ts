import customsRoutes from './customs'

// Mock the vue components
jest.mock('../views/customs/CustomCommissionCategoryList.vue', () => ({ name: 'CustomCommissionCategoryList' }))
jest.mock('../views/customs/CustomsCommissionsList.vue', () => ({ name: 'CustomsCommissionsList' }))

describe('Customs Routes', () => {
  it('should be an array of route objects', () => {
    expect(Array.isArray(customsRoutes)).toBe(true)
    expect(customsRoutes.length).toBe(4)
  })

  describe('Customs Menu Route', () => {
    const customsMenuRoute = customsRoutes.find(route => route.name === 'menu.customs')

    it('should have customs menu route', () => {
      expect(customsMenuRoute).toBeDefined()
      expect(customsMenuRoute?.path).toBe('/#')
      expect(customsMenuRoute?.meta?.icon).toBe('mdi-police-station')
      expect(customsMenuRoute?.meta?.isDropdown).toBe(true)
      expect(customsMenuRoute?.meta?.hasRole).toBe('ROLE_CUSTOMS')
    })
  })

  describe('Customs Commissions Route', () => {
    const commissionsRoute = customsRoutes.find(route => route.name === 'customs.commissions')

    it('should have commissions route', () => {
      expect(commissionsRoute).toBeDefined()
      expect(commissionsRoute?.path).toBe('/customs/commissions')
      expect(commissionsRoute?.component).toBeDefined()
      expect(commissionsRoute?.meta?.hasRole).toBe('ROLE_CUSTOMS')
      expect(commissionsRoute?.meta?.isDisabled).toBe(false)
      expect(commissionsRoute?.meta?.parent).toBe('menu.customs')
    })
  })

  describe('Customs Settings Route', () => {
    const settingsRoute = customsRoutes.find(route => route.name === 'customs.settings')

    it('should have settings route', () => {
      expect(settingsRoute).toBeDefined()
      expect(settingsRoute?.path).toBe('/#')
      expect(settingsRoute?.meta?.icon).toBe('mdi-cog')
      expect(settingsRoute?.meta?.isDropdown).toBe(true)
      expect(settingsRoute?.meta?.hasRole).toBe('ROLE_CUSTOMS_ADMIN')
      expect(settingsRoute?.meta?.parent).toBe('menu.customs')
      expect(settingsRoute?.meta?.title).toBe('settings')
    })
  })

  describe('Category List Route', () => {
    const categoryRoute = customsRoutes.find(route => route.name === 'customs.customsCommissionCategoryList')

    it('should have category list route', () => {
      expect(categoryRoute).toBeDefined()
      expect(categoryRoute?.path).toBe('/customs/settings/categories')
      expect(categoryRoute?.component).toBeDefined()
      expect(categoryRoute?.meta?.icon).toBe('mdi-invoice-text-check')
      expect(categoryRoute?.meta?.isDisabled).toBe(false)
      expect(categoryRoute?.meta?.title).toBe('customs.customsCommissionCategoryList')
      expect(categoryRoute?.meta?.parent).toBe('customs.settings')
      expect(categoryRoute?.meta?.root).toBe('menu.customs')
      expect(categoryRoute?.meta?.hasRole).toBe('ROLE_CUSTOMS_ADMIN')
    })
  })

  describe('Role-based Access', () => {
    it('should have role restrictions on all routes', () => {
      const routesWithRoles = customsRoutes.filter(route => route.meta?.hasRole)
      expect(routesWithRoles.length).toBe(customsRoutes.length)
    })

    it('should use appropriate customs roles', () => {
      const validRoles = ['ROLE_CUSTOMS', 'ROLE_CUSTOMS_ADMIN']

      customsRoutes.forEach(route => {
        if (route.meta?.hasRole) {
          expect(validRoles).toContain(route.meta.hasRole)
        }
      })
    })
  })

  describe('Menu Hierarchy', () => {
    it('should have proper parent-child relationships', () => {
      const menuCustomsChildren = customsRoutes.filter(route => route.meta?.parent === 'menu.customs')
      const settingsChildren = customsRoutes.filter(route => route.meta?.parent === 'customs.settings')

      expect(menuCustomsChildren.length).toBeGreaterThan(0)
      expect(settingsChildren.length).toBeGreaterThan(0)
    })

    it('should have dropdown menus properly configured', () => {
      const dropdownRoutes = customsRoutes.filter(route => route.meta?.isDropdown)

      dropdownRoutes.forEach(route => {
        expect(route.path).toBe('/#')
      })
    })

    it('should have root references for nested routes', () => {
      const routesWithRoot = customsRoutes.filter(route => route.meta?.root)

      expect(routesWithRoot.length).toBeGreaterThan(0)
      routesWithRoot.forEach(route => {
        expect(route.meta?.root).toBe('menu.customs')
      })
    })
  })

  describe('Route Icons', () => {
    it('should have appropriate Material Design icons', () => {
      const routesWithIcons = customsRoutes.filter(route => route.meta?.icon)

      expect(routesWithIcons.length).toBeGreaterThan(0)

      routesWithIcons.forEach(route => {
        expect(route.meta?.icon).toMatch(/^mdi-/)
      })
    })
  })

  describe('Component Loading', () => {
    it('should have components for non-dropdown routes', () => {
      const nonDropdownRoutes = customsRoutes.filter(route => !route.meta?.isDropdown)

      nonDropdownRoutes.forEach(route => {
        expect(route.component).toBeDefined()
      })
    })
  })
})