import { computed, ref } from "vue"
import api_base from '@/api/api_base';
import { Item } from '@/interfaces/item';

export function useCommonStore()
{
  const api = ref(api_base)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const error = ref(null)
  const item = ref(null as Item | null)
  const list = ref([] as Item[])
  const listLength = ref(0)

  const hasError = computed(() => { return error.value !== null })
  const hasItems = computed(() => { return list.value && list.value.length > 0 })

  async function deleteItem(id: number)
  {
    isLoading.value = true;
    error.value = null;
    try {
      await api.value.delete(id);
      isLoading.value = false;
      item.value = null;
      return true;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return false;
    }
  }
  async function findAll()
  {
    isLoading.value = true;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    try {
      let response = await api.value.findAll();
      list.value = response.data["member"];
      listLength.value = response.data["totalItems"];
      isLoading.value = false;
      return response.data;
    } catch (error) {
      isLoading.value = false;
      error = error;
      return null;
    }
  }
  async function find(id: number)
  {
    isLoading.value = true;
    error.value = null;
    item.value = null;
    try {
      let response = await api.value.find(id);
      isLoading.value = false;
      item.value = response.data;
      return response.data;
    } catch (error: any) {
      isLoading.value = false;
      error.value = error;
      return null;
    }
  }
  function getById(id: Number)
  {
    return list.value.find(e => e.id == id)
  }
  function reset()
  {
    isLoading.value = false;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    return true;
  }
  async function save(id: number, item: any)
  {
    isLoading.value = true;
    item.value = null;
    error.value = null;
    try {
      //#region properties rewriting
      for (let key in item) {
        let property = item[key];
        if (property != null && typeof (property) == "object" && '@id' in property) {
          property = property['@id'];
        } else if (property != null && Array.isArray(property)) {
          for (let p2 in property) {
            if (property[p2] != null && typeof (property[p2]) == "object" && '@id' in property[p2]) {
              property[p2] = property[p2]['@id'];
            }
          }
        }
        item[key] = property;
      }
      //#endregion

      if (item.id && parseInt(item.id) > 0) {
        let response = await api.value.save(id, item)
        isLoading.value = false;
        item = response.data;
        return response.data;
      } else {
        let response = await api.value.add(item);
        isLoading.value = false;
        item = response.data;
        return response.data;
      }
    } catch (error) {
      isLoading.value = false;
      error = error;
      return null;
    }
  }
  function resetError()
  {
    error.value = null;
  }
  function setApi(api: any)
  {
    api.value = api;
  }

  return {
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
    setApi,
  }
}
