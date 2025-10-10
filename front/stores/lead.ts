import { defineStore } from 'pinia'
import thisAPI from '@/api/lead'
import { useBaseStore } from './baseStore';
import { Lead } from '@/interfaces/lead';
import { LeadComment } from '@/interfaces/leadcomment';
import { useLeadTypeStore } from '@/stores/leadType'
import { DatatableSortBy } from '@/interfaces/datatableSortBy';


export const useLeadStore = defineStore('lead', () =>
{
  const {
    api,
    availableFields,
    context,
    currentPage,
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

  //load all leadType children object
  const leadTypeStore = useLeadTypeStore()
  if (leadTypeStore.listLength == 0) {
    leadTypeStore.findAll()
  }

  defaultContext.value = {
    currentPage: 1,
    filters: {},
    sortBy: { key: 'createdAt', order: 'desc' } as DatatableSortBy,
    version: "1.0",
    visibleFields: [
      { "key": "createdAt" },
      { "key": "customerName" },
      { "key": "leadType" },
      { "key": "countryOfEstablishment" },
      { "key": "countryOfDestination" },
      { "key": "society" },
      { "key": "user" }
    ],
  }

  fieldsByType.value.boolean = ['rgpdAccepted', 'onNewsletterList']
  fieldsByType.value.count = ['leadComments']
  fieldsByType.value.date = ['reminderDate']
  fieldsByType.value.datetime = ['createdAt', 'lastUpdatedAt']
  fieldsByType.value.object = [
    { name: 'agency', type: 'agency' },
    { name: 'society', type: 'society' },
    { name: 'user', type: 'user' },
    { name: 'countryOfDestination', type: 'country' },
    { name: 'countryOfEstablishment', type: 'country' },
    { name: 'origin', type: 'origin' },
    { name: 'businessSector', type: 'businessSector' },
    { name: 'serviceDomain', type: 'serviceDomain' },
    { name: 'serviceType', type: 'serviceType' },
  ]
  fieldsByType.value.objectsList = [
    { name: 'refusalReasons', type: 'leadRefusalReason' },
  ]
  fieldsByType.value.progressBar = [{ name: 'leadType', store: leadTypeStore, type: 'leadType' }]
  fieldsByType.value.string = ['customerName', 'email']

  localStorageName.value = "CrmLead"


  function parseItem(item: Lead)
  {
    //#region properties rewriting
    if (item.needsDescription == null) {
      item.needsDescription = "";
    }
    if (item.leadComments != null) {
      for (let property in item.leadComments) {
        if (item.leadComments[property] != null && typeof (item.leadComments[property]) == "object" && '@id' in item.leadComments[property]) {
          item.leadComments[property] = item.leadComments[property]['@id'];
        }
      }
    }
    if (item.leadHistories != null) {
      for (let property in item.leadHistories) {
        if (item.leadHistories[property] != null && typeof (item.leadHistories[property]) == "object" && '@id' in item.leadHistories[property]) {
          item.leadHistories[property] = item.leadHistories[property]['@id'];
        }
      }
    }
    if (item.refusalReasons != null) {
      for (let property in item.refusalReasons) {
        if (item.refusalReasons[property] != null && typeof (item.refusalReasons[property]) == "object" && '@id' in item.refusalReasons[property]) {
          item.refusalReasons[property] = item.refusalReasons[property]['@id'];
        }
      }
    }
    if (item != null) {
      for (let property in item) {
        if (item[property] != null && typeof (item[property]) == "object" && '@id' in item[property]) {
          item[property] = item[property]['@id'];
        }
      }
    }
    //#endregion
    return item;
  }


  async function addLeadComment(leadComment: LeadComment)
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.addLeadComment(leadComment)
      isLoading.value = false;
      return response.data;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }



  async function transformIntoProspect(lead: Lead)
  {
    isLoading.value = true;
    error.value = null;
    item.value = null;
    lead = parseItem(lead);
    try {
      let response = await thisAPI.transformIntoProspect(lead)
      isLoading.value = false;
      item.value = response.data;
      return response.data;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error
      item.value = null;
      return null;
    }
  }

  return {
    availableFields,
    context,
    currentPage,
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

    addLeadComment,
    parseArrays,
    parseItem,
    transformIntoProspect,
  }
})
