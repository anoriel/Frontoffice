import { defineStore } from 'pinia'
import thisAPI from '@/api/leadType'
import { useBaseStore } from './baseStore';
import { LeadType } from '@/interfaces/leadtype';
import { ref, watch } from 'vue';

export const useLeadTypeStore = defineStore('leadType', () =>
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

  const language = "fr"

  const lowestLeadTypePosition = ref(0)
  const highestLeadTypePosition = ref(0)

  watch(list, () =>
  {
    lowestLeadTypePosition.value = getLowestPosition()
    highestLeadTypePosition.value = getHighestPosition()
  })

  function getHighestPosition()
  {
    let arr = JSON.parse(JSON.stringify(list.value));
    if (!arr.length) { return 0; }
    arr = arr.filter(function (e: LeadType) { return !e.isHidden; }).sort(function (a: LeadType, b: LeadType) { return a.position < b.position ? -1 : (a.position > b.position ? 1 : 0); }).reverse();
    return Math.max(arr[0].position - 1, 0);
  }

  function getLowestPosition()
  {
    let arr = JSON.parse(JSON.stringify(list.value));
    if (!arr.length) { return 0; }
    arr = arr.filter(function (e: LeadType) { return !e.isHidden; }).sort(function (a: LeadType, b: LeadType) { return a.position < b.position ? -1 : (a.position > b.position ? 1 : 0); });
    return Math.max(arr[0].position - 1, 0);
  }
  function getColorByValue(value: LeadType | null)
  {
    if (value == null) { return 'warning' }
    switch (value?.name) {
      case 'lost':
        return 'text-white';

      case 'spam':
        return 'text-white';

      case 'won':
        return 'text-white';

      default:
        return 'grey-darken-4';
    }
  }
  function getValue(value: LeadType | null) { return value ? value.position - lowestLeadTypePosition.value : 0 }
  function getVariantByValue(value: LeadType | null)
  {
    if (value == null) { return 'warning' }
    switch (value?.name) {
      case 'lost':
        return 'error';

      case 'spam':
        return 'grey-darken-4';

      case 'undefined':
        return 'warning';

      case 'won':
        return 'success';

      default:
        return 'primary';
    }
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
    reset,
    save,
    resetError,

    highestLeadTypePosition,
    language,
    lowestLeadTypePosition,

    getColorByValue,
    getHighestPosition,
    getLowestPosition,
    getValue,
    getVariantByValue,
  }
})
