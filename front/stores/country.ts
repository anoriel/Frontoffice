import { defineStore } from 'pinia'
import thisAPI from '@/api/country'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useCountryStore = defineStore('country', () => extendedValues)
