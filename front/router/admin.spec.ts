import adminRoutes from './admin'

// Mock the vue components
jest.mock('../views/admin/UserSecurity.vue', () => ({ name: 'UserSecurity' }))
jest.mock('../views/admin/CurrentlyLoggedUsers.vue', () => ({ name: 'CurrentlyLoggedUsers' }))

describe('Admin Routes', () => {
  it('should be an array of route objects', () => {
    expect(Array.isArray(adminRoutes)).toBe(true)
    expect(adminRoutes.length).toBe(3)
  })

  describe('Admin Menu Route', () => {
    const adminMenuRoute = adminRoutes.find(route => route.name === 'admin.admin')

    it('should have admin menu route', () => {
      expect(adminMenuRoute).toBeDefined()
      expect(adminMenuRoute?.path).toBe('/#')
      expect(adminMenuRoute?.meta?.icon).toBe('mdi-security')
      expect(adminMenuRoute?.meta?.isDropdown).toBe(true)
      expect(adminMenuRoute?.meta?.hasRole).toBe('ROLE_SUPER_ADMIN')
    })
  })

  describe('User Security Route', () => {
    const userSecurityRoute = adminRoutes.find(route => route.name === 'admin.userSecurity')

    it('should have user security route', () => {
      expect(userSecurityRoute).toBeDefined()
      expect(userSecurityRoute?.path).toBe('/admin/userSecurity')
      expect(userSecurityRoute?.component).toBeDefined()
      expect(userSecurityRoute?.meta?.title).toBe('admin.userSecurity')
      expect(userSecurityRoute?.meta?.parent).toBe('admin.admin')
      expect(userSecurityRoute?.meta?.hasRole).toBe('ROLE_SUPER_ADMIN')
      expect(userSecurityRoute?.meta?.isDisabled).toBe(false)
    })

    it('should have correct icon', () => {
      expect(userSecurityRoute?.meta?.icon).toBe('mdi-account-group')
    })
  })

  describe('Currently Logged Users Route', () => {
    const currentlyLoggedRoute = adminRoutes.find(route => route.name === 'admin.currentlyLoggedUsers')

    it('should have currently logged users route', () => {
      expect(currentlyLoggedRoute).toBeDefined()
      expect(currentlyLoggedRoute?.path).toBe('/admin/currentlyLoggedUsers')
      expect(currentlyLoggedRoute?.component).toBeDefined()
      expect(currentlyLoggedRoute?.meta?.title).toBe('admin.currentlyLoggedUsers')
      expect(currentlyLoggedRoute?.meta?.parent).toBe('admin.admin')
      expect(currentlyLoggedRoute?.meta?.hasRole).toBe('ROLE_SUPER_ADMIN')
      expect(currentlyLoggedRoute?.meta?.isDisabled).toBe(false)
    })

    it('should have correct icon', () => {
      expect(currentlyLoggedRoute?.meta?.icon).toBe('mdi-account-key')
    })
  })

  describe('Security and Access Control', () => {
    it('should require ROLE_SUPER_ADMIN for all routes', () => {
      adminRoutes.forEach(route => {
        expect(route.meta?.hasRole).toBe('ROLE_SUPER_ADMIN')
      })
    })

    it('should have icons for all routes', () => {
      adminRoutes.forEach(route => {
        expect(route.meta?.icon).toBeDefined()
        expect(route.meta?.icon).toMatch(/^mdi-/)
      })
    })
  })

  describe('Menu Hierarchy', () => {
    it('should have proper parent-child relationships', () => {
      const parentRoute = adminRoutes.find(route => route.name === 'admin.admin')
      const childRoutes = adminRoutes.filter(route => route.meta?.parent === 'admin.admin')

      expect(parentRoute).toBeDefined()
      expect(childRoutes.length).toBe(2)
    })

    it('should have dropdown menu properly configured', () => {
      const dropdownRoute = adminRoutes.find(route => route.meta?.isDropdown)

      expect(dropdownRoute).toBeDefined()
      expect(dropdownRoute?.path).toBe('/#')
      expect(dropdownRoute?.name).toBe('admin.admin')
    })
  })

  describe('Route Configuration', () => {
    it('should have all required route properties', () => {
      adminRoutes.forEach(route => {
        expect(route.name).toBeDefined()
        expect(route.path).toBeDefined()
        expect(route.meta).toBeDefined()
      })
    })

    it('should have components for non-dropdown routes', () => {
      const nonDropdownRoutes = adminRoutes.filter(route => !route.meta?.isDropdown)

      nonDropdownRoutes.forEach(route => {
        expect(route.component).toBeDefined()
      })
    })
  })

  describe('Administrative Functions', () => {
    it('should include user management functionality', () => {
      const userSecurityRoute = adminRoutes.find(route => route.name === 'admin.userSecurity')
      expect(userSecurityRoute).toBeDefined()
    })

    it('should include session monitoring functionality', () => {
      const loggedUsersRoute = adminRoutes.find(route => route.name === 'admin.currentlyLoggedUsers')
      expect(loggedUsersRoute).toBeDefined()
    })
  })
})