import { defineStore } from 'pinia'
import thisAPI from '@/api/serviceDomain';
import { useCommonStore } from './commonStore';

export const useServiceDomainStore = defineStore('serviceDomain', () =>
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
