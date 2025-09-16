import { defineStore } from 'pinia'
import thisAPI from '@/api/crmListSettings'
import { useBaseStore } from './baseStore';
import { ref } from 'vue';

export const useCrmListSettings = defineStore('crmListSettings', () =>
{
  const {
    api,
    currentPage,
    isLoading,
    error,
    item,
    list,
    listLength,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  const itemsByTypeList = ref<Record<string, any[]>>({})
  const itemsByTypeLength = ref<Record<string, number>>({})



  function getItemsByTypeList(type: string)
  {
    return itemsByTypeList.value[type] ?? [];
  }

  async function findItemsByType(type: string)
  {
    isLoading.value = true;
    error.value = null;
    itemsByTypeList.value[type] = [];
    itemsByTypeLength.value[type] = 0;
    try {
      let response = await thisAPI.findItemsByType(type);
      isLoading.value = false;
      itemsByTypeList.value[type] = response.data["member"];
      itemsByTypeLength.value[type] = response.data["totalItems"];
      return response.data["member"];
    } catch (throwable: any) {
      isLoading.value = false;
      error.value = throwable;
      return null;
    }
  }

  function reset()
  {
    isLoading.value = false;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    itemsByTypeList.value = {};
    itemsByTypeLength.value = {};
    return true;
  }


  return {
    currentPage,
    isLoading,
    error,
    item,
    list,
    listLength,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    save,
    resetError,

    itemsByTypeList,
    itemsByTypeLength,

    findItemsByType,
    getItemsByTypeList,
    reset,
  }
})
