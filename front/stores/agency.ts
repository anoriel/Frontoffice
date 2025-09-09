import { defineStore } from 'pinia'
import thisAPI from '@/api/agency'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
  onlyActive: false,

  async findAllActive()
  {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await thisAPI.findAllActive();
      this.isLoading = false;
      this.list = response.data["member"];
      this.listLength = response.data["totalItems"];
      return response.list;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
}

export const useAgencyStore = defineStore('agency', () => extendedValues)
