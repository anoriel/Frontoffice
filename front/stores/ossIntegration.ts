import { defineStore } from 'pinia'
import thisAPI from '@/api/ossIntegration'
import { useBaseStore } from './baseStore';
import { DatatableSortByInterface } from '@/interfaces/DatatableSortByInterface';


export const useOssIntegrationStore = defineStore('ossIntegration', () =>
{
  const {
    api,
    availableFields,
    context,
    currentPage,
    customMapping,
    defaultContext,
    fieldsByType,
    filters,
    isLoading,
    error,
    item,
    list,
    totalItems,
    localStorageName,
    mapping,
    visibleFields,

    deleteItem,
    exportList,
    find,
    findAll,
    findPage,
    hasError,
    hasItems,
    getById,
    getContextKey,
    getFiltersDiff,
    getNumberOfFilters,
    getOrderBy,
    getPageCount,
    getSearchFilters,
    getVisibleFields,
    parseArrays,
    reset,
    save,
    setSearchFilters,
    setVisibleFields,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  defaultContext.value = {
    currentPage: 1,
    filters: {
    },
    sortBy: { key: 'createdAt', order: 'asc' } as DatatableSortByInterface,
    version: "1.0",
    visibleFields: [
      { "key": "customer" },
      { "key": "invoiceConditions" },
      { "key": "user" },
      { "key": "status" },
      { "key": "createdAt" },
    ],
  }

  fieldsByType.value.datetime = ['createdAt']
  fieldsByType.value.object = [
    { name: 'customer', type: 'customer' },
    { name: 'invoiceConditions', type: 'invoiceCondition' },
    { name: 'user', type: 'user' },
    { name: 'status', type: 'fileIntegrationStatus' },
  ]

  localStorageName.value = "CrmOssIntegration"

  return {
    availableFields,
    context,
    currentPage,
    customMapping,
    fieldsByType,
    isLoading,
    error,
    filters,
    item,
    list,
    totalItems,
    mapping,
    visibleFields,

    deleteItem,
    exportList,
    find,
    findAll,
    findPage,
    hasError,
    hasItems,
    getById,
    getContextKey,
    getFiltersDiff,
    getNumberOfFilters,
    getOrderBy,
    getPageCount,
    getSearchFilters,
    getVisibleFields,
    reset,
    save,
    setSearchFilters,
    setVisibleFields,
    resetError,

    defaultContext,
    localStorageName,

    parseArrays,
  }
})
