import { defineStore } from 'pinia'
import thisAPI from '@/api/customer'
import { useBaseStore } from './baseStore';
import { useCustomerTypeStore } from '@/stores/customerType'
import { DatatableSortBy } from '@/interfaces/datatableSortBy';
import { useContacTypeStore } from './contactType';


export const useCustomerStore = defineStore('customer', () =>
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
    listLength,
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

  //load all customerType children object
  const customerTypeStore = useCustomerTypeStore()
  if (customerTypeStore.listLength == 0) {
    customerTypeStore.findAll()
  }

  //override customMapping for better display in filter dialog
  customMapping.value = {
    nomSociete: {},
    'customerType.id': {},
    'country.id': {},
    'agency.id': {},
    'society.id': {},
    'user.id': {},
    contactType: { type: 'object', enum: useContacTypeStore().list, queryPrefix: 'contacts' },
    'contacts.keynews': { stringValue: 'contact.keynews' },
    'contacts.mailingList': { stringValue: 'contact.mailingList' },

    'contacts.contactAutofac': { hidden: true },
    'contacts.contactDeb': { hidden: true },
    'contacts.contactFacture': { hidden: true },
    'contacts.contactFiscal': { hidden: true },
    'contacts.contactRelance': { hidden: true },
  }

  defaultContext.value = {
    currentPage: 1,
    filters: {
      'customerType.id': [1000, 1001],
    },
    sortBy: { key: 'nomSociete', order: 'asc' } as DatatableSortBy,
    version: "1.0",
    visibleFields: [
      { "key": "dateAjout" },
      { "key": "nomSociete" },
      { "key": "customerType" },
      { "key": "country" },
      { "key": "society" },
      { "key": "agency" },
      { "key": "utilisateur" },
    ],
  }

  fieldsByType.value.boolean = []
  fieldsByType.value.count = []
  fieldsByType.value.date = ['dateRelance']
  fieldsByType.value.datetime = ['dateAjout']
  fieldsByType.value.object = [
    { name: 'agency', type: 'agency' },
    { name: 'society', type: 'society' },
    { name: 'utilisateur', type: 'user' },
    { name: 'country', type: 'country' },
    { name: 'customerType', type: 'customerType' },
  ]
  fieldsByType.value.objectsList = [
    { name: 'contacts', type: 'contact' },
  ]
  fieldsByType.value.progressBar = []
  fieldsByType.value.string = ['nomSociete', 'tel', 'email', 'reference']

  localStorageName.value = "CrmCustomer"


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
    listLength,
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
