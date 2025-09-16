import { defineStore } from 'pinia'
import thisAPI from '@/api/leadType'
import { useBaseStore } from './baseStore';
import { LeadType } from '@/interfaces/leadtype';

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
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  const language = "fr"

  function getHighestPosition()
  {
    let arr = JSON.parse(JSON.stringify(list.value));
    if (!arr.length) { return 0; }
    arr = arr.filter(function (e: LeadType) { return !e.isHidden; }).sort(function (a: LeadType, b: LeadType) { return a.position < b.position ? -1 : (a.position > b.position ? 1 : 0); }).reverse();
    return arr[0].position;
  }

  function getLowestPosition()
  {
    let arr = JSON.parse(JSON.stringify(list.value));
    if (!arr.length) { return 0; }
    arr = arr.filter(function (e: LeadType) { return !e.isHidden; }).sort(function (a: LeadType, b: LeadType) { return a.position < b.position ? -1 : (a.position > b.position ? 1 : 0); });
    return arr[0].position;
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

    language,

    getHighestPosition,
    getLowestPosition,
  }
})
