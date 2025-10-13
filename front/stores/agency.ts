import { defineStore } from 'pinia'
import thisAPI from '@/api/agency'
import { useBaseStore } from './baseStore';
import { ref } from 'vue';

export const useAgencyStore = defineStore('agency', () =>
{
  const {
    api,
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    parseResponse,
    reset,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  const onlyActive = ref(false)

  async function findAllActive()
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.findAllActive();
      parseResponse(response);
      return response.list;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

  return {
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,

    onlyActive,

    findAllActive,
  }
})
