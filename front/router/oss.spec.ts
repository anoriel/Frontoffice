import ossRoutes from './oss'

// Mock the vue components
jest.mock('../views/oss/Dashboard.vue', () => ({ name: 'OSSDashboard' }))
jest.mock('../views/oss/Integration.vue', () => ({ name: 'OSSIntegration' }))

describe('OSS Routes', () => {
  it('should be an array of route objects', () => {
    expect(Array.isArray(ossRoutes)).toBe(true)
    expect(ossRoutes.length).toBe(3)
  })

  describe('OSS Menu Route', () => {
    const ossMenuRoute = ossRoutes.find(route => route.name === 'OSS.OSS')

    it('should have OSS menu route', () => {
      expect(ossMenuRoute).toBeDefined()
      expect(ossMenuRoute?.path).toBe('/#')
      expect(ossMenuRoute?.meta?.flag).toBe('eu')
      expect(ossMenuRoute?.meta?.isDropdown).toBe(true)
      expect(ossMenuRoute?.meta?.hasRole).toBe('ROLE_OSS')
    })

    it('should use EU flag instead of icon', () => {
      expect(ossMenuRoute?.meta?.flag).toBe('eu')
      expect(ossMenuRoute?.meta?.icon).toBeUndefined()
    })
  })

  describe('OSS Dashboard Route', () => {
    const dashboardRoute = ossRoutes.find(route => route.name === 'OSS.dashboard')

    it('should have dashboard route', () => {
      expect(dashboardRoute).toBeDefined()
      expect(dashboardRoute?.path).toBe('/oss/dashboard')
      expect(dashboardRoute?.component).toBeDefined()
      expect(dashboardRoute?.meta?.isDisabled).toBe(false)
      expect(dashboardRoute?.meta?.title).toBe('OSS.dashboardTitle')
      expect(dashboardRoute?.meta?.parent).toBe('OSS.OSS')
      expect(dashboardRoute?.meta?.hasRole).toBe('ROLE_OSS')
    })
  })

  describe('OSS Integration Route', () => {
    const integrationRoute = ossRoutes.find(route => route.name === 'OSS.integration')

    it('should have integration route with parameter', () => {
      expect(integrationRoute).toBeDefined()
      expect(integrationRoute?.path).toBe('/oss/integration/:id')
      expect(integrationRoute?.component).toBeDefined()
      expect(integrationRoute?.meta?.parent).toBe('OSS.OSS')
      expect(integrationRoute?.meta?.isHidden).toBe(true)
      expect(integrationRoute?.meta?.title).toBe('OSS.integrationTitle')
      expect(integrationRoute?.meta?.hasRole).toBe('ROLE_OSS')
    })

    it('should be hidden from menu', () => {
      expect(integrationRoute?.meta?.isHidden).toBe(true)
    })
  })

  describe('Role-based Access', () => {
    it('should have role restrictions on all routes', () => {
      const routesWithRoles = ossRoutes.filter(route => route.meta?.hasRole)
      expect(routesWithRoles.length).toBe(ossRoutes.length)
    })

    it('should require ROLE_OSS for all routes', () => {
      ossRoutes.forEach(route => {
        expect(route.meta?.hasRole).toBe('ROLE_OSS')
      })
    })
  })

  describe('Menu Hierarchy', () => {
    it('should have proper parent-child relationships', () => {
      const childRoutes = ossRoutes.filter(route => route.meta?.parent === 'OSS.OSS')
      expect(childRoutes.length).toBe(2)
    })

    it('should have dropdown menu properly configured', () => {
      const dropdownRoute = ossRoutes.find(route => route.meta?.isDropdown)

      expect(dropdownRoute).toBeDefined()
      expect(dropdownRoute?.path).toBe('/#')
      expect(dropdownRoute?.name).toBe('OSS.OSS')
    })
  })

  describe('Route Configuration', () => {
    it('should have all required properties', () => {
      ossRoutes.forEach(route => {
        expect(route.name).toBeDefined()
        expect(route.path).toBeDefined()
        expect(route.meta).toBeDefined()
      })
    })

    it('should have components for non-dropdown routes', () => {
      const nonDropdownRoutes = ossRoutes.filter(route => !route.meta?.isDropdown)

      nonDropdownRoutes.forEach(route => {
        expect(route.component).toBeDefined()
      })

      expect(nonDropdownRoutes.length).toBe(2)
    })

    it('should have titles for visible routes', () => {
      const visibleRoutes = ossRoutes.filter(route => !route.meta?.isDropdown)

      visibleRoutes.forEach(route => {
        expect(route.meta?.title).toBeDefined()
        expect(typeof route.meta?.title).toBe('string')
      })
    })
  })

  describe('Route Parameters', () => {
    it('should have parameterized route for integration', () => {
      const integrationRoute = ossRoutes.find(route => route.name === 'OSS.integration')
      expect(integrationRoute?.path).toContain(':id')
    })
  })

  describe('EU Flag Configuration', () => {
    it('should use EU flag for main menu', () => {
      const menuRoute = ossRoutes.find(route => route.name === 'OSS.OSS')
      expect(menuRoute?.meta?.flag).toBe('eu')
    })
  })
})