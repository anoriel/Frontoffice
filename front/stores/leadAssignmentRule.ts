import { defineStore } from 'pinia'
import thisAPI from '@/api/leadAssignmentRule'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
}

export const useLeadAssignmentRuleStore = defineStore('leadAssignmentRule', () => extendedValues)
