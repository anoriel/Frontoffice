import { defineStore } from 'pinia'
import thisAPI from '@/api/vatInvoice'
import { useBaseStore } from './baseStore';
import { DatatableSortByInterface } from '@/interfaces/DatatableSortByInterface';
import useCommonHelper from '../helpers/commonHelper'
import { ref, watch } from 'vue';
import { CustomerInterface } from '@/interfaces/CustomerInterface';
import { InvoiceConditionInterface } from '@/interfaces/InvoiceconditionInterface';
const helpers = useCommonHelper()


export const useVatInvoiceStore = defineStore('vatInvoice', () =>
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
    pageCountIsLoading,
    totalItems,
    localStorageName,
    mapping,
    visibleFields,

    deleteItem,
    exportList,
    find,
    findAll,
    hasError,
    hasItems,
    getById,
    getContextKey,
    getFiltersDiff,
    getNumberOfFilters,
    getOrderBy,
    getSearchFilters,
    getVisibleFields,
    parseArrays,
    reset,
    save,
    setContextKey,
    setSearchFilters,
    setVisibleFields,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  defaultContext.value = {
    currentPage: 1,
    filters: {
    },
    sortBy: { key: 'numero', order: 'desc' } as DatatableSortByInterface,
    version: "1.0",
    visibleFields: [
      { "key": "operationType" },
      { "key": "number" },
      { "key": "invoiceDate" },
      { "key": "currentPeriod" },
      { "key": "thirdParty" },
      { "key": "taxFreeAmount" },
      { "key": "taxAmount" },
      { "key": "VATRate" },
      { "key": "currency" },
      { "key": "createdAt" },
    ],
  }

  fieldsByType.value.boolean = []
  fieldsByType.value.count = []
  fieldsByType.value.date = []
  fieldsByType.value.datetime = []
  fieldsByType.value.object = []
  fieldsByType.value.objectsList = []
  fieldsByType.value.progressBar = []
  fieldsByType.value.string = []

  localStorageName.value = "CrmVatInvoice"

  const customer = ref<CustomerInterface | null>(null)
  const invoiceCondition = ref<InvoiceConditionInterface | null>(null)

  watch(() => customer.value, () =>
  {
    setContextKey("customer", JSON.stringify(customer.value));
  });
  watch(() => invoiceCondition.value, () =>
  {
    setContextKey("invoiceCondition", JSON.stringify(invoiceCondition.value));
  });

  async function findPage(page: number, perPage: number, sortBy: DatatableSortByInterface, filtersArray: any, _isNullArray?: any, _isNotNullArray?: any)
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.findPage(page, perPage, sortBy.property ?? sortBy.key, sortBy.order, filtersArray);
      list.value = response.data;
      totalItems.value = null;//must count in a separate query
      isLoading.value = false;
      return list.value;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

  function getActionOnOpeningItem(id: number)
  {
    let url = helpers.legacyIntranetUrl + "/admin/vue_tva_facture_detail.php?action_suivante=affiche_modifier&id=" + id;
    return { url: url };
  }

  async function getPageCount(searchFilters?: any)
  {
    pageCountIsLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.getPageCount(searchFilters);
      totalItems.value = 'data' in response ? response.data : 0;
      pageCountIsLoading.value = false;
      return totalItems.value;
    } catch (error: any) {
      pageCountIsLoading.value = false;
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
    pageCountIsLoading,
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
    getActionOnOpeningItem,
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

    customer,
    defaultContext,
    invoiceCondition,
    localStorageName,

    parseArrays,
  }
})
