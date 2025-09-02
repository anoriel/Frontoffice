import { defineStore } from 'pinia'
import thisAPI from '@/api/leadRefusalReason'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useLeadRefusalReasonStore = defineStore('leadRefusalReason', () => extendedValues)
