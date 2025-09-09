import { defineStore } from 'pinia'
import thisAPI from '@/api/businessSector'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useBusinessSectorStore = defineStore('businessSector', () => extendedValues)
