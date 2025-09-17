jest.mock('lodash', () => ({
  isEqual: jest.fn((a, b) => a === b),
}))

jest.mock('moment', () => {
  const mockMoment = jest.fn(() => ({
    format: jest.fn().mockReturnValue('2023-01-15'),
    toDate: jest.fn().mockReturnValue(new Date('2023-01-15')),
    subtract: jest.fn().mockReturnThis(),
    startOf: jest.fn().mockReturnThis(),
    endOf: jest.fn().mockReturnThis(),
  }))
  mockMoment.mockReturnValue({
    format: jest.fn().mockReturnValue('2023-01-15'),
    toDate: jest.fn().mockReturnValue(new Date('2023-01-15')),
    subtract: jest.fn().mockReturnThis(),
    startOf: jest.fn().mockReturnThis(),
    endOf: jest.fn().mockReturnThis(),
  })
  return mockMoment
})

jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    creator: '',
    created: new Date(),
    modified: new Date(),
    addWorksheet: jest.fn().mockReturnValue({
      addTable: jest.fn(),
      eachRow: jest.fn(),
      getColumn: jest.fn().mockReturnValue({ width: 0 }),
      columnCount: 1
    }),
    xlsx: {
      writeBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
    }
  }))
}))

jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}))

jest.mock('crypto-js', () => ({
  SHA1: jest.fn(() => ({ toString: () => 'abcdef123456789abcdef123456789abcdef12' })),
  SHA256: jest.fn(() => 'hashedemail123456789')
}))

import useCommonHelper from './commonHelper'
import moment from 'moment'

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    getContext: jest.fn(() => ({
      font: '',
      measureText: jest.fn(() => ({ width: 100 }))
    }))
  }))
})

describe('Common Helper', () => {
  let helper: ReturnType<typeof useCommonHelper>

  beforeEach(() => {
    jest.clearAllMocks()
    helper = useCommonHelper()
  })

  describe('String Utilities', () => {
    describe('capitalizeFirstLetter', () => {
      it('should capitalize first letter of string', () => {
        expect(helper.capitalizeFirstLetter('hello')).toBe('Hello')
        expect(helper.capitalizeFirstLetter('HELLO')).toBe('HELLO')
        expect(helper.capitalizeFirstLetter('h')).toBe('H')
      })

      it('should handle empty or null strings', () => {
        expect(helper.capitalizeFirstLetter('')).toBe('')
        expect(helper.capitalizeFirstLetter(null)).toBe('')
        expect(helper.capitalizeFirstLetter(undefined)).toBe('')
      })
    })

    describe('lowercaseFirstLetter', () => {
      it('should lowercase first letter of string', () => {
        expect(helper.lowercaseFirstLetter('Hello')).toBe('hello')
        expect(helper.lowercaseFirstLetter('HELLO')).toBe('hELLO')
        expect(helper.lowercaseFirstLetter('H')).toBe('h')
      })
    })

    describe('initiale', () => {
      it('should return first letter uppercase', () => {
        expect(helper.initiale('hello')).toBe('H')
        expect(helper.initiale('world')).toBe('W')
      })
    })

    describe('padZero', () => {
      it('should pad with zeros to specified length', () => {
        expect(helper.padZero('5', 3)).toBe('005')
        expect(helper.padZero(5, 3)).toBe('005')
        expect(helper.padZero('12', 4)).toBe('0012')
      })

      it('should use default length of 2', () => {
        expect(helper.padZero('5')).toBe('05')
        expect(helper.padZero('12')).toBe('12')
      })
    })

    describe('sprintf', () => {
      it('should replace %s placeholders with arguments', () => {
        expect(helper.sprintf('Hello %s', 'World')).toBe('Hello World')
        expect(helper.sprintf('Hello %s %s', 'Beautiful', 'World')).toBe('Hello Beautiful World')
      })

      it('should return original string if no arguments', () => {
        expect(helper.sprintf('Hello World')).toBe('Hello World')
      })
    })

    describe('numberToString', () => {
      it('should convert numbers to string words', () => {
        expect(helper.numberToString(0)).toBe('zero')
        expect(helper.numberToString(5)).toBe('five')
        expect(helper.numberToString(12)).toBe('twelve')
      })

      it('should return "none" for numbers out of range', () => {
        expect(helper.numberToString(15)).toBe('none')
        expect(helper.numberToString(-1)).toBe('none')
      })
    })
  })

  describe('Type Checking', () => {
    describe('isArray', () => {
      it('should correctly identify arrays', () => {
        expect(helper.isArray([])).toBe(true)
        expect(helper.isArray([1, 2, 3])).toBe(true)
        expect(helper.isArray('string')).toBe(false)
        expect(helper.isArray({})).toBe(false)
        expect(helper.isArray(null)).toBe(false)
      })
    })

    describe('isObject', () => {
      it('should correctly identify objects', () => {
        expect(helper.isObject({})).toBe(true)
        expect(helper.isObject({ key: 'value' })).toBe(true)
        expect(helper.isObject([])).toBe(true) // Arrays are objects in JS
        expect(helper.isObject('string')).toBe(false)
        expect(helper.isObject(null)).toBe(false)
      })
    })

    describe('isEmptyOrNull', () => {
      it('should correctly identify empty or null values', () => {
        expect(helper.isEmptyOrNull(null)).toBe(true)
        expect(helper.isEmptyOrNull(undefined)).toBe(true)
        expect(helper.isEmptyOrNull('')).toBe(true)
        expect(helper.isEmptyOrNull('hello')).toBe(false)
        expect(helper.isEmptyOrNull(0)).toBe(false)
        expect(helper.isEmptyOrNull([])).toBe(false)
      })
    })
  })

  describe('Object Utilities', () => {
    describe('areObjectsEqual', () => {
      it('should compare objects correctly', () => {
        const obj1 = { a: 1, b: 2 }
        const obj2 = { b: 2, a: 1 }
        const obj3 = { a: 1, b: 3 }

        expect(helper.areObjectsEqual(obj1, obj2)).toBe(true)
        expect(helper.areObjectsEqual(obj1, obj3)).toBe(false)
      })
    })

    describe('getDifference', () => {
      it('should return differences between objects', () => {
        const a = { name: 'John', age: 30, city: 'NYC' }
        const b = { name: 'John', age: 31, city: 'LA' }
        
        const diff = helper.getDifference(a, b)
        
        expect(diff).toEqual({ age: 31, city: 'LA' })
      })
    })

    describe('toString', () => {
      it('should convert various types to string', () => {
        expect(helper.toString('hello')).toBe('hello')
        expect(helper.toString(123)).toBe('123')
        expect(helper.toString(null)).toBe('')
        expect(helper.toString(undefined)).toBe('')
      })

      it('should handle objects with stringValue', () => {
        const obj = { stringValue: 'test value' }
        expect(helper.toString(obj)).toBe('test value')
      })

      it('should handle complex objects', () => {
        const obj = { b: 'second', a: 'first' }
        expect(helper.toString(obj)).toBe('first second')
      })
    })
  })

  describe('Array Utilities', () => {
    describe('removeDuplicates', () => {
      it('should remove duplicate items from array', () => {
        const arr = [1, 2, 2, 3, 3, 3, 4]
        const result = helper.removeDuplicates(arr)
        expect(result).toEqual([1, 2, 3, 4])
      })

      it('should handle object arrays', () => {
        const arr = [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' }
        ]
        const result = helper.removeDuplicates(arr)
        expect(result).toHaveLength(2)
      })
    })

    describe('removeItemFromList', () => {
      it('should remove item from list by id', () => {
        const list = [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
          { id: 3, name: 'Bob' }
        ]
        const itemToRemove = { id: 2 }
        
        helper.removeItemFromList(itemToRemove, list)
        
        expect(list).toHaveLength(2)
        expect(list.find(item => item.id === 2)).toBeUndefined()
      })
    })

    describe('listWithSlots', () => {
      it('should add slot items to beginning of list', () => {
        const list = [
          { id: 1, label: 'Item 1' },
          { id: 2, label: 'Item 2' }
        ]
        
        const result = helper.listWithSlots(list)
        
        expect(result[0]).toEqual({ id: 0, label: 'anything' })
        expect(result[1]).toEqual({ id: -1, label: 'not assigned' })
        expect(result).toHaveLength(4)
      })
    })
  })

  describe('Date Utilities', () => {
    describe('formatDate', () => {
      beforeEach(() => {
        (moment as any).mockReturnValue({
          format: jest.fn().mockReturnValue('2023-01-15')
        })
      })

      it('should format date correctly', () => {
        const result = helper.formatDate('2023-01-15T10:30:00')
        expect(result).toBe('2023-01-15')
      })

      it('should return undefined for null/undefined values', () => {
        expect(helper.formatDate(null)).toBeUndefined()
        expect(helper.formatDate(undefined)).toBeUndefined()
      })
    })

    describe('formatDateTime', () => {
      beforeEach(() => {
        (moment as any).mockReturnValue({
          format: jest.fn().mockReturnValue('2023-01-15 10:30:00')
        })
      })

      it('should format datetime correctly', () => {
        const result = helper.formatDateTime('2023-01-15T10:30:00')
        expect(result).toBe('2023-01-15 10:30:00')
      })
    })

    describe('formatPeriod', () => {
      beforeEach(() => {
        (moment as any).mockReturnValue({
          format: jest.fn().mockReturnValue('2023-01')
        })
      })

      it('should format period correctly', () => {
        const result = helper.formatPeriod('2023-01-15')
        expect(result).toBe('2023-01')
      })
    })

    describe('ExcelDateToJSDate', () => {
      it('should convert Excel serial date to JS Date', () => {
        const serial = 44927 // Represents 2023-01-01
        const result = helper.ExcelDateToJSDate(serial)
        
        expect(result).toBeInstanceOf(Date)
        expect(result.getFullYear()).toBeGreaterThan(2000)
      })
    })

    describe('clearDate', () => {
      it('should clear date range', () => {
        const range = {
          startDate: new Date(),
          endDate: new Date()
        }
        
        helper.clearDate(range)
        
        expect(range.startDate).toBeNull()
        expect(range.endDate).toBeNull()
      })
    })
  })

  describe('Crypto and Hash Functions', () => {
    describe('getGravatarURL', () => {
      it('should generate gravatar URL', () => {
        const url = helper.getGravatarURL('test@example.com', 32, 'identicon')
        
        expect(url).toContain('https://www.gravatar.com/avatar/')
        expect(url).toContain('s=32')
        expect(url).toContain('d=identicon')
      })

      it('should use default parameters', () => {
        const url = helper.getGravatarURL('test@example.com')
        
        expect(url).toContain('s=24')
        expect(url).toContain('d=wavatar')
      })
    })

    describe('getHexColor', () => {
      it('should generate hex color from ciphertext', () => {
        const mockThis = { $vueCryptojs: {} }
        const color = helper.getHexColor.call(mockThis as any, 'test', 0)
        
        expect(color).toHaveLength(6)
        expect(color).toMatch(/^[a-fA-F0-9]+$/)
      })

      it('should handle special cases', () => {
        const mockThis = { $vueCryptojs: {} }
        
        expect(helper.getHexColor.call(mockThis as any, 0)).toBe('000000')
        expect(helper.getHexColor.call(mockThis as any, -1)).toBe('FFFFFF')
      })
    })
  })

  describe('Deep Comparison and Diff', () => {
    describe('deepCompareWithoutOrder', () => {
      it('should compare objects deeply without order consideration', () => {
        const obj1 = { a: 1, b: { c: 2, d: 3 } }
        const obj2 = { b: { d: 3, c: 2 }, a: 1 }
        
        // Mock lodash isEqual to return true for equal objects
        const mockIsEqual = require('lodash').isEqual as jest.Mock
        mockIsEqual.mockReturnValue(true)
        
        expect(helper.deepCompareWithoutOrder(obj1, obj2)).toBe(true)
      })
    })

    describe('deepDiffMapper', () => {
      it('should create diff mapper with correct methods', () => {
        const mapper = helper.deepDiffMapper()
        
        expect(mapper.VALUE_CREATED).toBe('created')
        expect(mapper.VALUE_UPDATED).toBe('updated')
        expect(mapper.VALUE_DELETED).toBe('deleted')
        expect(mapper.VALUE_UNCHANGED).toBe('unchanged')
        expect(typeof mapper.map).toBe('function')
        expect(typeof mapper.compareValues).toBe('function')
      })

      it('should compare values correctly', () => {
        const mapper = helper.deepDiffMapper()
        
        expect(mapper.compareValues('same', 'same')).toBe('unchanged')
        expect(mapper.compareValues(undefined, 'new')).toBe('created')
        expect(mapper.compareValues('old', undefined)).toBe('deleted')
        expect(mapper.compareValues('old', 'new')).toBe('updated')
      })

      it('should identify data types correctly', () => {
        const mapper = helper.deepDiffMapper()
        
        expect(mapper.isFunction(() => {})).toBe(true)
        expect(mapper.isArray([])).toBe(true)
        expect(mapper.isDate(new Date())).toBe(true)
        expect(mapper.isObject({})).toBe(true)
        expect(mapper.isValue('string')).toBe(true)
        expect(mapper.isValue({})).toBe(false)
      })
    })
  })

  describe('Utility Functions', () => {
    describe('sleep', () => {
      it('should complete without error', () => {
        // Mock console.log to avoid spam during tests
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        
        expect(() => helper.sleep(1)).not.toThrow()
        
        consoleSpy.mockRestore()
      })
    })

    describe('getHourFromDate', () => {
      beforeEach(() => {
        (moment as any).mockReturnValue({
          format: jest.fn().mockReturnValue('14:30:00')
        })
      })

      it('should extract hour from date', () => {
        const result = helper.getHourFromDate('2023-01-15T14:30:00')
        expect(result).toBe('14:30:00')
      })

      it('should return undefined for null values', () => {
        expect(helper.getHourFromDate(null)).toBeUndefined()
      })
    })

    describe('getObjectNameWithCountry', () => {
      it('should return country code with string value', () => {
        const obj = {
          iso3166: 'US',
          stringValue: 'United States'
        }
        
        expect(helper.getObjectNameWithCountry(obj)).toBe('USUnited States')
      })

      it('should handle nested country object', () => {
        const obj = {
          pays: { iso3166: 'FR' },
          stringValue: 'France'
        }
        
        expect(helper.getObjectNameWithCountry(obj)).toBe('FRFrance')
      })

      it('should return undefined for invalid objects', () => {
        const obj = { stringValue: 'Test' }
        expect(helper.getObjectNameWithCountry(obj)).toBeUndefined()
      })
    })
  })
})