import { defineStore } from 'pinia'
import thisAPI from '@/api/serviceType'
import { useCommonStore } from './commonStore';

export const useServiceTypeStore = defineStore('serviceType', () =>
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


  return {
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
  }
})
