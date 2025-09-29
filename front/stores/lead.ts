import { defineStore } from 'pinia'
import thisAPI from '@/api/lead'
import { useBaseStore } from './baseStore';
import useCommonHelper from '../helpers/commonHelper'
const helpers = useCommonHelper()
import { Lead } from '@/interfaces/lead';
import { LeadComment } from '@/interfaces/leadcomment';
import { useLeadTypeStore } from '@/stores/leadType'


export const useLeadStore = defineStore('lead', () =>
{
  const {
    api,
    availableFields,
    currentPage,
    defaultContext,
    fieldsByType,
    isLoading,
    isLoadingWithLock,
    error,
    item,
    list,
    listLength,
    localStorageName,
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
    getSearchFilters,
    getVisibleFields,
    reset,
    save,
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
    filters: {
      agency: [],
      businessSector: [],
      countryOfDestination: null,
      countryOfEstablishment: null,
      customerName: null,
      email: null,
      leadType: [],
      onNewsletterList: null,
      reminderDateRange: {
        startDate: null, //moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"),
        endDate: null, //moment().endOf('month').format("YYYY-MM-DD"),
      },
      rgpdAccepted: null,
      serviceDomain: [],
      serviceType: [],
      society: [],
      user: null,
    },
    sortBy: 'createdAt',
    sortDesc: true,
    sortDirection: 'desc',
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
  fieldsByType.value.datetime = ['createdAt', 'lastUpdatedAt']
  fieldsByType.value.object = [
    { name: 'agency', type: 'agency' },
    { name: 'countryOfDestination', type: 'country' },
    { name: 'countryOfEstablishment', type: 'country' },
    { name: 'society', type: 'society' },
    { name: 'user', type: 'user' },
  ]
  fieldsByType.value.progressBar = [{ name: 'leadType', store: leadTypeStore, type: 'leadType' }]
  fieldsByType.value.string = ['businessSector', 'origin', 'serviceDomain', 'serviceType']
  fieldsByType.value.stringsList = ['refusalReasons']

  localStorageName.value = "CrmLead"

  function parseArrays(filters: any)
  {
    let filtersArray = [];
    let isNullArray = [];
    let isNotNullArray = [];
    for (let i in filters) {
      let filter = filters[i];
      if (filter != null) {
        if (['countryOfDestination', 'countryOfEstablishment', 'leadType', 'onNewsletterList', 'rgpdAccepted', 'user'].includes(i)) {
          if (filter.id == -1) {
            isNullArray.push(i);
          }
          else if (filter.id === 0) {
            isNotNullArray.push(i);
          }
          else if ([true, false].includes(filter.id)) {
            filtersArray.push({
              'key': i,
              'value': filter.id ? 1 : 0
            });
          }
          else {
            filtersArray.push({
              'key': i + '.id',
              'value': filter.id
            });
          }
        } else if ('customerName' == i) {
          filtersArray.push({
            'key': i,
            'value': filter
          });
        } else if ('email' == i) {
          filtersArray.push({
            'key': i,
            'value': filter
          });
        } else if ('reminderDateRange' == i) {
          if ("startDate" in filter && "endDate" in filter && filter.startDate == filter.endDate && filter.startDate != null) {
            filtersArray.push({
              'key': "reminderDate",
              'value': helpers.formatDate(filter.startDate)
            });
          } else {
            if ("startDate" in filter && filter.startDate != null) {
              filtersArray.push({
                'key': 'reminderDate[after]',
                'value': helpers.formatDate(filter.startDate)
              });
            }
            if ("endDate" in filter && filter.endDate != null) {
              filtersArray.push({
                'key': 'reminderDate[before]',
                'value': helpers.formatDate(filter.endDate)
              });
            }
          }
        } else if (['agencies', 'businessSectors', 'leadTypes', 'serviceDomains', 'serviceTypes', 'societies'].includes(i)) {
          for (let j in filter) {
            let subFilter = filter[j];
            let key = null;
            switch (i) {
              case 'agencies':
                key = 'agency';
                break;
              case 'businessSectors':
                key = 'businessSector';
                break;
              case 'leadTypes':
                key = 'leadType';
                break;
              case 'serviceDomains':
                key = 'serviceDomain';
                break;
              case 'serviceTypes':
                key = 'serviceType';
                break;
              case 'societies':
                key = 'society';
                break;
              default:
            }

            if (subFilter.id == -1) {
              isNullArray.push(key);
            }
            else if (subFilter.id == 0) {
              isNotNullArray.push(key);
            }
            else {
              filtersArray.push({
                'key': key + '.id[]',
                'value': subFilter.id
              });
            }
          }
        }
      }
    }
    return [filtersArray, isNullArray, isNotNullArray];
  }

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

  function parseSortBy(sortBy: string, sortDesc: boolean)
  {
    if (typeof sortBy == 'undefined') {
      sortBy = 'createdAt';
      sortDesc = true;
    } else if (typeof sortDesc == 'undefined') {
      sortDesc = false;
    }
    if (['serviceDomain', 'serviceType', 'businessSector'].includes(sortBy)) {
      sortBy = `${sortBy}.name`;
    } else if (['countryOfDestination', 'countryOfEstablishment', 'society', 'user'].includes(sortBy)) {
      sortBy = `${sortBy}.nom`;
    } else if (['leadType'].includes(sortBy)) {
      sortBy = `${sortBy}.position`;
    }

    return [sortBy, sortDesc];
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
    currentPage,
    fieldsByType,
    isLoading,
    isLoadingWithLock,
    error,
    item,
    list,
    listLength,
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
    getSearchFilters,
    getVisibleFields,
    reset,
    save,
    setVisibleFields,
    resetError,

    defaultContext,
    localStorageName,

    addLeadComment,
    parseArrays,
    parseItem,
    parseSortBy,
    transformIntoProspect,
  }
})
