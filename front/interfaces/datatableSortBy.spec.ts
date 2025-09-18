import type { DatatableSortBy, OrderBy } from './datatableSortBy'

describe('DatatableSortBy Interface', () => {
  describe('OrderBy Type', () => {
    it('should accept "asc" value', () => {
      const order: OrderBy = 'asc'
      expect(order).toBe('asc')
    })

    it('should accept "desc" value', () => {
      const order: OrderBy = 'desc'
      expect(order).toBe('desc')
    })

    it('should be used in type checking', () => {
      const validOrders: OrderBy[] = ['asc', 'desc']
      expect(validOrders).toHaveLength(2)
      expect(validOrders).toContain('asc')
      expect(validOrders).toContain('desc')
    })
  })

  describe('DatatableSortBy Interface', () => {
    it('should have key property as string', () => {
      const sortBy: DatatableSortBy = {
        key: 'name',
        order: 'asc'
      }

      expect(typeof sortBy.key).toBe('string')
      expect(sortBy.key).toBe('name')
    })

    it('should have order property as OrderBy', () => {
      const sortByAsc: DatatableSortBy = {
        key: 'created',
        order: 'asc'
      }

      const sortByDesc: DatatableSortBy = {
        key: 'modified',
        order: 'desc'
      }

      expect(sortByAsc.order).toBe('asc')
      expect(sortByDesc.order).toBe('desc')
    })

    it('should work with different column names', () => {
      const sortConfigs: DatatableSortBy[] = [
        { key: 'id', order: 'asc' },
        { key: 'name', order: 'desc' },
        { key: 'email', order: 'asc' },
        { key: 'created_at', order: 'desc' },
        { key: 'updated_at', order: 'asc' }
      ]

      expect(sortConfigs).toHaveLength(5)

      sortConfigs.forEach(config => {
        expect(typeof config.key).toBe('string')
        expect(['asc', 'desc']).toContain(config.order)
      })
    })
  })

  describe('Real-world Usage', () => {
    it('should work for user table sorting', () => {
      const userSorts: DatatableSortBy[] = [
        { key: 'firstName', order: 'asc' },
        { key: 'lastName', order: 'asc' },
        { key: 'email', order: 'desc' },
        { key: 'joinDate', order: 'desc' }
      ]

      expect(userSorts[0].key).toBe('firstName')
      expect(userSorts[3].order).toBe('desc')
    })

    it('should work for product table sorting', () => {
      const productSort: DatatableSortBy = {
        key: 'price',
        order: 'desc'
      }

      expect(productSort.key).toBe('price')
      expect(productSort.order).toBe('desc')
    })

    it('should work for date-based sorting', () => {
      const dateSorts = [
        { key: 'createdAt', order: 'desc' as OrderBy },
        { key: 'modifiedAt', order: 'asc' as OrderBy }
      ]

      expect(dateSorts[0].order).toBe('desc')
      expect(dateSorts[1].order).toBe('asc')
    })
  })

  describe('Sorting Functions', () => {
    it('should be usable in sorting logic', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 35 }
      ]

      const sortByAge: DatatableSortBy = { key: 'age', order: 'asc' }
      const sortByName: DatatableSortBy = { key: 'name', order: 'desc' }

      // Mock sorting function using the interface
      const sortData = (data: any[], sortBy: DatatableSortBy) => {
        return data.sort((a, b) => {
          const aVal = a[sortBy.key]
          const bVal = b[sortBy.key]

          if (sortBy.order === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }

      const sortedByAge = sortData([...data], sortByAge)
      expect(sortedByAge[0].age).toBe(25) // Jane should be first

      const sortedByName = sortData([...data], sortByName)
      expect(sortedByName[0].name).toBe('John') // John should be first when desc
    })

    it('should work with multiple sort criteria', () => {
      const multiSort: DatatableSortBy[] = [
        { key: 'department', order: 'asc' },
        { key: 'salary', order: 'desc' }
      ]

      expect(multiSort).toHaveLength(2)
      expect(multiSort[0].key).toBe('department')
      expect(multiSort[1].order).toBe('desc')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty key', () => {
      const sortBy: DatatableSortBy = {
        key: '',
        order: 'asc'
      }

      expect(sortBy.key).toBe('')
      expect(sortBy.order).toBe('asc')
    })

    it('should handle nested property keys', () => {
      const sortBy: DatatableSortBy = {
        key: 'user.profile.name',
        order: 'desc'
      }

      expect(sortBy.key).toBe('user.profile.name')
      expect(sortBy.order).toBe('desc')
    })

    it('should handle numeric-like keys', () => {
      const sortBy: DatatableSortBy = {
        key: '123',
        order: 'asc'
      }

      expect(sortBy.key).toBe('123')
      expect(typeof sortBy.key).toBe('string')
    })
  })
})