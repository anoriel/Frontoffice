import { defineStore } from 'pinia'
import thisAPI from '@/api/society'

import { useBaseStore } from './baseStore';

export const useSocietyStore = defineStore('society', () =>
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

  async function findAllActive()
  {
    isLoading.value = true;
    error.value = null;
    list.value = [];
    try {
      let response = await thisAPI.findAllActive();
      parseResponse(response);
      return list;
    } catch (error) {
      isLoading.value = false;
      error = error;
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
    findAllActive,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,
  }
})
