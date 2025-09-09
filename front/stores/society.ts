import { defineStore } from 'pinia'
import thisAPI from '@/api/society'
import { baseStore } from './baseStore'

let extendedValues = {
  ...baseStore,
  api: thisAPI,
  async findAllActive()
  {
    this.isLoading = true;
    this.error = null;
    this.list = [];
    try {
      let response = await thisAPI.findAllActive();
      this.isLoading = false;
      this.list = response.data["member"];
      this.listLength = response.data["totalItems"];
      return this.list;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      return null;
    }
  },
}

export const useSocietyStore = defineStore('society', () => extendedValues)
