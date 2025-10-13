import { defineStore } from 'pinia'
import thisAPI from '@/api/user'
import { useBaseStore } from '@/stores/baseStore';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () =>
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
    parseResponse,
    reset,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI

  const currentlyLoggedUsersCount = ref(0)
  const currentlyLoggedUsersList = ref([])
  const currentlyLoggedUsersListLength = ref(0)
  const filteredList = ref([])
  const filteredListLength = ref(0)

  async function refreshAll()
  {
    error.value = null;
    try {
      let response = await api.value.findAll();
      parseResponse(response);
      return response.data;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err
      return null;
    }
  }

  function customReset()
  {
    reset();
    item.value = null;
    filteredList.value = [];
    filteredListLength.value = 0;
    return true;
  }

  async function findAllActive(showFullData: boolean = false)
  {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await thisAPI.findAllActive(showFullData);
      parseResponse(response);
      return response.list;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }

  async function findByRole(role: string)
  {
    customReset()
    try {
      let response = await thisAPI.findBy(false, role);
      isLoading.value = false;
      filteredList.value = response.data["member"];
      filteredListLength.value = response.data["totalItems"];
      return response.data;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  async function getCurrentlyLoggedUsers()
  {
    customReset()
    try {
      let response = await thisAPI.getCurrentlyLoggedUsers();
      isLoading.value = false;
      error.value = null;
      currentlyLoggedUsersList.value = response.data;
      currentlyLoggedUsersListLength.value = response.data.length;
      return response.data;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  async function getNumberOfCurrentlyLoggedUsers()
  {
    isLoading.value = true;
    error.value = null;
    currentlyLoggedUsersCount.value = 0;
    try {
      let response = await thisAPI.getNumberOfCurrentlyLoggedUsers();
      isLoading.value = false;
      error.value = null;
      currentlyLoggedUsersCount.value = response.data;
      return response.data;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  return {
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    find,
    findAll,
    findAllActive,
    hasError,
    hasItems,
    getById,
    reset: customReset,
    save,

    currentlyLoggedUsersCount,
    currentlyLoggedUsersList,
    currentlyLoggedUsersListLength,
    filteredList,
    filteredListLength,
    resetError,
    refreshAll,
    findByRole,
    getCurrentlyLoggedUsers,
    getNumberOfCurrentlyLoggedUsers,
  }
})
