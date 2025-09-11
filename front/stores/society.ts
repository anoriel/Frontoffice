import { defineStore } from 'pinia'
import thisAPI from '@/api/society'

import { useCommonStore } from './commonStore';

export const useSocietyStore = defineStore('society', () =>
{
  const {
    api,
    currentPage,
    isLoading,
    error,
    item,
    list,
    listLength,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,
  } = useCommonStore();

  api.value = thisAPI

  async function findAllActive()
  {
    isLoading.value = true;
    error.value = null;
    list.value = [];
    try {
      let response = await thisAPI.findAllActive();
      isLoading.value = false;
      list.value = response.data["member"];
      listLength.value = response.data["totalItems"];
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
    listLength,
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
