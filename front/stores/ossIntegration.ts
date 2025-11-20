import { defineStore } from 'pinia'
import thisAPI from '@/api/ossIntegration'
import { useBaseStore } from './baseStore';
import { DatatableSortByInterface } from '@/interfaces/DatatableSortByInterface';
import { ref } from 'vue';
import { AvailableFieldInterface } from '@/interfaces/AvailableFieldInterface';
import { FileIntegrationValidatedColumnInterface } from '@/interfaces/FileIntegrationValidatedColumnInterface';
import { FileIntegrationStatusInterface } from '@/interfaces/FileIntegrationStatusInterface';
import { OssIntegrationInterface } from '@/interfaces/OssIntegrationInterface';
import { FileImportationErrorInterface } from '@/interfaces/FileImportationErrorInterface';


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
    find: baseFind,
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


  //file header & lines detail
  const fileHeaders = ref<AvailableFieldInterface[]>([]);
  const fileLinesDetail = ref([]);

  async function find(id: number)
  {
    let data = await baseFind(id);
    if (data != null) {
      const oss = data as OssIntegrationInterface;
      if (oss.importationParameters?.dataErrorsList) {
        oss.importationParameters.dataErrorsList.forEach((element) =>
        {
          element.replacementValue = null;
        });
      }
    }
    return data;
  }

  function getActionOnOpeningItem(id: number)
  {
    return { name: 'OSS.integration', params: { id: id } };
  }

  async function getFileLinesDetail(id: number)
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.getFileLinesDetail(id);
      let availableFields: AvailableFieldInterface[] = [];
      Object.keys(response.data.fileHeaders).forEach((key: string) =>
      {
        let element = response.data.fileHeaders[key];
        element.items.unshift({
          key: 'ignore',
          text: 'ignore',
          value: null,
        })
        availableFields.push({
          'key': key,
          items: element.items,
          value: element.value,
        })
      });
      fileHeaders.value = availableFields;
      fileLinesDetail.value = response.data.fileLinesDetail;
      return list.value;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

  async function setColumns(id: number, validatedColumnsList: Record<string, FileIntegrationValidatedColumnInterface>): Promise<FileIntegrationStatusInterface | null>
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.setColumns(id, validatedColumnsList)
      return response.data as FileIntegrationStatusInterface;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

  async function setReplacements(id: number, dataErrorsList: FileImportationErrorInterface[])
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.setReplacements(id, dataErrorsList)
      return response.data as FileIntegrationStatusInterface;
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

    defaultContext,
    fileHeaders,
    fileLinesDetail,
    localStorageName,

    getFileLinesDetail,
    parseArrays,
    setColumns,
    setReplacements,
  }
})
