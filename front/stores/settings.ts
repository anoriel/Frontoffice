import { defineStore } from 'pinia'
import thisAPI from '@/api/settings'
import { useBaseStore } from './baseStore';
import { ref } from 'vue';
import { Setting } from '@/interfaces/setting';

export const useSettingsStore = defineStore('settings', () =>
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

  const settingsByStorageName = ref<Record<string, Setting[]>>({})
  const settingsByStorageNameLength = ref<Record<string, number>>({})

  function getSettingsByStorageName(storageName: string)
  {
    return settingsByStorageName.value[storageName] ?? [];
  }

  async function findSettingsByStorageName(storageName: string)
  {
    isLoading.value = true;
    error.value = null;
    settingsByStorageName.value[storageName] = [];
    settingsByStorageNameLength.value[storageName] = 0;
    try {
      let response = await thisAPI.findItemsByStorageName(storageName);
      isLoading.value = false;
      settingsByStorageName.value[storageName] = response.data["member"];
      settingsByStorageNameLength.value[storageName] = response.data["totalItems"];
      return response.data["member"];
    } catch (throwable: any) {
      isLoading.value = false;
      error.value = throwable;
      return null;
    }
  }

  async function saveSettingsByStorageName(storageName: string, setting: Setting)
  {
    let result = await save(setting.id ?? -1, setting);
    if (result) {
      let index = settingsByStorageName.value[storageName].findIndex(s => s.id === setting.id);
      if (index !== -1) {
        settingsByStorageName.value[storageName][index] = setting;
      } else {
        settingsByStorageName.value[storageName].push(setting);
        settingsByStorageNameLength.value[storageName]++;
      }
    }
    return result;
  }

  function reset()
  {
    isLoading.value = false;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    settingsByStorageName.value = {};
    settingsByStorageNameLength.value = {};
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

    settingsByStorageName,
    settingsByStorageNameLength,

    findSettingsByStorageName,
    getSettingsByStorageName,
    saveSettingsByStorageName,
    reset,
  }
})
