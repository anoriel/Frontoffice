import { defineStore } from 'pinia'
import thisAPI from '@/api/operationType'
import { useBaseStore } from './baseStore';

export const useOperationTypeStore = defineStore('operationType', () =>
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
    reset,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI


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
  }
})
