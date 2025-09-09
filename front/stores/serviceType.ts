import { defineStore } from 'pinia'
import thisAPI from '@/api/serviceType'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useServiceTypeStore = defineStore('serviceType', () => extendedValues)
