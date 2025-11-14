import { defineStore } from 'pinia'
import thisAPI from '@/api/vatInvoice'
import { useBaseStore } from './baseStore';
import { DatatableSortByInterface } from '@/interfaces/DatatableSortByInterface';
import useCommonHelper from '../helpers/commonHelper'
import { ref, watch } from 'vue';
import { CustomerInterface } from '@/interfaces/CustomerInterface';
import { InvoiceConditionInterface } from '@/interfaces/InvoiceconditionInterface';
import { merge } from 'lodash';
import { AxiosResponse } from 'axios';
import moment from 'moment';
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
    setMapping,
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
  //add customer and invoicecontion to the default context as they are not part of base defaultContext
  merge(defaultContext.value, {
    customer: null,
    invoiceCondition: null,
  })

  fieldsByType.value.date = ['invoiceDate']
  fieldsByType.value.datetime = ['createdAt']
  fieldsByType.value.float4 = ['taxFreeAmount', 'taxAmount', 'VATRate']
  fieldsByType.value.period = ['currentPeriod']
  fieldsByType.value.string = ['operationType']

  //override customMapping for better display in filter dialog
  customMapping.value = {
    number: {},
    operationType: { type: 'object', object: 'operationType', queryPrefix: 'operationType' },
    invoiceDate: { type: 'date' },
    currentPeriod: { type: 'date' },
  }

  setMapping()

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

  async function findPage(page: number, perPage: number, sortBy: DatatableSortByInterface, filters: any)
  {
    isLoading.value = true;
    error.value = null;
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
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

  async function find(id: number)
  {
    isLoading.value = true;
    error.value = null;
    item.value = null;
    try {
      let response = await api.value.find(id);
      isLoading.value = false;
      item.value = parseItemResponse(response);
      return item.value;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  function getActionOnOpeningItem(id: number)
  {
    let url = helpers.legacyIntranetUrl + "/admin/vue_tva_facture_detail.php?action_suivante=affiche_modifier&id=" + id;
    return { url: url };
  }

  async function getPageCount(filters?: any)
  {
    pageCountIsLoading.value = true;
    error.value = null;
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
    try {
      let response = await thisAPI.getPageCount(filtersArray);
      totalItems.value = 'data' in response ? response.data : 0;
      pageCountIsLoading.value = false;
      return totalItems.value;
    } catch (error: any) {
      pageCountIsLoading.value = false;
      error.value = error;
      return null;
    }
  }

  function parseItemResponse(response: AxiosResponse<any, any, {}>)
  {
    if ('createdAt' in response.data) {
      response.data.createdAt = moment(new Date(response.data.createdAt)).tz("Europe/Paris").format('YYYY-MM-DD HH:mm:ss')
    }
    if ('invoiceDate' in response.data) {
      response.data.invoiceDate = moment(new Date(response.data.invoiceDate)).tz("Europe/Paris").format('YYYY-MM-DD')
    }
    if ('currentPeriod' in response.data) {
      response.data.currentPeriod = moment(new Date(response.data.currentPeriod)).tz("Europe/Paris").format('YYYY-MM-DD')
    }
    //formatPeriod
    if ('customer' in response.data) {
      response.data.thirdParty = response.data.customer.stringValue;
    }
    if ('operationType' in response.data) {
      response.data.operationType = response.data.operationType.code;
    }
    return response.data;
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
