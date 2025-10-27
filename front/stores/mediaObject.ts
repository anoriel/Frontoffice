import { defineStore } from 'pinia'
import thisAPI from '@/api/mediaObject'
import { useBaseStore } from './baseStore';

export const useMediaObjectStore = defineStore('mediaObject', () =>
{
  const {
    api,
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
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

  async function getMediaObject(url: string, filename: string)
  {
    let response = await thisAPI.getMediaObject(url);

    var headers = response.headers
    const blob = new Blob([response.data], { type: headers['content-type'] })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)

    return response;
  }


  return {
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,

    getMediaObject,
  }
})
