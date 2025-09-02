import { defineStore } from 'pinia'
import thisAPI from '@/api/leadOrigin'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useLeadOriginStore = defineStore('leadOrigin', () => extendedValues)
