import { defineStore } from 'pinia'
import thisAPI from '@/api/fileIntegrationStatus'
import { useBaseStore } from './baseStore';

export const useFileIntegrationStatusStore = defineStore('fileIntegrationStatus', () =>
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
    find,
    findAll,
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
