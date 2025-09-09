import { defineStore } from 'pinia'
import thisAPI from '@/api/serviceDomain'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useServiceDomainStore = defineStore('serviceDomain', () => extendedValues)
