import { defineStore } from 'pinia'
import thisAPI from '@/api/invoiceCondition'
import { useBaseStore } from './baseStore';
import { DatatableSortByInterface } from '@/interfaces/DatatableSortByInterface';
import { CustomerInterface } from '@/interfaces/CustomerInterface';


export const useInvoiceConditionStore = defineStore('invoiceCondition', () =>
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
    parseResponse,
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
    visibleFields: [],
  }

  localStorageName.value = "CrmInvoiceCondition"

  async function findByParent(customer: CustomerInterface, language: string = 'fr')
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.findByParent(customer, language);
      parseResponse(response);
      return list.value;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

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

    findByParent,
    parseArrays,
  }
})
