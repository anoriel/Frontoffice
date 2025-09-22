import { computed, ref, watch } from "vue"
import api_base from '@/api/api_base';
import { Item } from '@/interfaces/item';
import useCommonHelper from '../helpers/commonHelper'
import { DatatableSortBy } from "@/interfaces/datatableSortBy";
const helpers = useCommonHelper()

interface AvailableField { 'key': string, 'sortable': boolean, 'title': string | null }

export function useBaseStore()
{
  const api = ref(api_base)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const isLoadingWithLock = ref(false)
  const error = ref(null)
  const item = ref(null as Item | null)
  const list = ref([] as Item[])
  const listLength = ref(0)


  const availableFields = ref<AvailableField[]>([])
  const context = ref<Record<string, any>>({})
  const defaultContext = ref<Record<string, any>>({})
  const localStorageName = ref("base")
  const visibleFields = ref<AvailableField[]>([])

  const hasError = computed(() => { return error.value !== null })
  const hasItems = computed(() => { return list.value && list.value.length > 0 })


  watch(visibleFields, () =>
  {
    setContextKey('visibleFields', visibleFields.value)
  })

  async function deleteItem(id: number)
  {
    isLoading.value = true;
    error.value = null;
    try {
      await api.value.delete(id);
      isLoading.value = false;
      item.value = null;
      return true;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return false;
    }
  }

  async function exportList(sortBy: DatatableSortBy, filters: any, properties: any)
  {
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
    let isNullArray = parsed[1];
    let isNotNullArray = parsed[2];

    parsed = parseSortBy(sortBy.key, sortBy.order == 'asc');

    isLoadingWithLock.value = true;
    error.value = null;
    try {
      let response = await api.value.export(parsed[0], parsed[1] ? 'desc' : 'asc', filtersArray, isNullArray, isNotNullArray, properties);
      isLoadingWithLock.value = false;
      return response.data;
    } catch (error: any) {
      error.value = error.data
      return null;
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
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
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
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  async function findPage(page: number, perPage: number, sortBy: string, sortDesc: boolean, filters: any)
  {
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
    let isNullArray = parsed[1];
    let isNotNullArray = parsed[2];


    isLoading.value = true;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    try {
      let response = await api.value.findPage(page, perPage, sortBy, sortDesc ? 'desc' : 'asc', filtersArray, isNullArray, isNotNullArray);
      isLoading.value = false;
      list.value = response.data["member"];
      listLength.value = response.data["totalItems"];


      if (typeof response.data != 'undefined' && "member" in response.data && list.value.length > 0) {
        let keyToIgnore = ['id'];
        let fields = Object.keys(list.value[0]).filter(function (e)
        {
          if ((e && typeof e === "object" && "stringValue" in e) || (typeof e === "string" && e[0] !== "@")) {
            return true;
          }
          return false;
        });
        availableFields.value = [];
        let mapping = response.data['search']['mapping'];
        try {
          for (let i in fields) {
            let field = fields[i];
            if (keyToIgnore.includes(field)) {
              continue;
            }
            let found = mapping.find(function (el: { variable: string; property: string | null }) { return el.variable.startsWith('orderBy') && el.property != null && el.property.startsWith(field); });
            availableFields.value.push({ 'key': field, 'sortable': found != null, 'title': null });
          }
        } catch (error) {
          console.log(error);
        }
      }

      return list.value;
    } catch (err: any) {
      isLoading.value = false;
      error.value = err.data;
      return null;
    }
  }

  function getById(id: number)
  {
    return list.value.find(e => e.id == id)
  }

  function getContext()
  {
    //check if context exists
    if ((typeof context.value == 'undefined' || JSON.stringify(context.value) == '{}') && localStorage.getItem(localStorageName.value + ".context")) {
      context.value = JSON.parse(localStorage.getItem(localStorageName.value + ".context") ?? "");
    } else if ((typeof context.value == 'undefined' || JSON.stringify(context.value) == '{}')) {
      context.value = JSON.parse(JSON.stringify(defaultContext.value));
      localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context.value));
    }

    //check context version and replace if it has changed, this will avoid to keep old potentially bugged localStorage
    if (defaultContext.value.version != context.value.version) {
      context.value = JSON.parse(JSON.stringify(defaultContext.value));
      localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context.value));
    }

    return context.value;
  }

  function getContextKey(key: string | null = null)
  {
    //check if context exists
    getContext()

    //check if context.key iexists
    if (key != null && typeof context.value[key] == 'undefined' && typeof defaultContext.value[key] != 'undefined') {
      context.value[key] = JSON.parse(JSON.stringify(defaultContext.value[key]));
      localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context.value));
    } else if (key != null && typeof defaultContext.value[key] == 'undefined') {
      console.log(key);
    }

    return key != null ? context.value[key] : context.value;
  }

  function getFiltersDiff()
  {
    if (typeof context.value == 'undefined' || typeof context.value.filters == 'undefined') {
      return {};
    }
    let filledProps = Object.keys(context.value.filters).reduce((newObj, key) =>
    {
      const value = context.value.filters[key];
      if ((typeof defaultContext.value.filters != 'undefined' && key in defaultContext.value.filters)) {
        const defaultValue = defaultContext.value.filters[key];
        let compare = helpers.deepCompareWithoutOrder(value, defaultValue);
        if (!compare) {
          newObj[key] = { "value": value, "defaultValue": defaultValue };
        }
      } else if (!(key in defaultContext.value.filters)) {
        newObj[key] = { "value": value, "defaultValue": null };
      }
      return newObj;
    }, {} as Record<string, any>);
    return filledProps;
  }

  function getVisibleFields()
  {
    if (Object.keys(visibleFields.value).length == 0) {
      visibleFields.value = getContextKey("visibleFields");
    }
    return visibleFields.value;
  }

  function getNumberOfFilters()
  {
    return Object.keys(getFiltersDiff()).length;
  }

  function parseArrays(filters: any)
  {
    return [filters, [], []];
  }

  function parseItem(item: any)
  {
    return item;
  }

  function parseSortBy(sortBy: string, sortDesc: boolean)
  {
    return [sortBy, sortDesc];
  }

  function reset()
  {
    isLoading.value = false;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    return true;
  }

  function resetError()
  {
    error.value = null;
  }

  async function save(id: number, itemData: any)
  {
    isLoading.value = true;
    error.value = null;
    try {
      //#region properties rewriting
      for (let key in itemData) {
        let property = itemData[key];
        if (property != null && typeof (property) == "object" && '@id' in property) {
          property = property['@id'];
        } else if (property != null && Array.isArray(property)) {
          for (let p2 in property) {
            if (property[p2] != null && typeof (property[p2]) == "object" && '@id' in property[p2]) {
              property[p2] = property[p2]['@id'];
            }
          }
        }
        itemData[key] = property;
      }
      //#endregion

      let response = null
      if (itemData.id && parseInt(itemData.id) > 0) {
        response = await api.value.save(id, itemData)
      } else {
        response = await api.value.add(itemData);
      }
      if (response != null) {
        isLoading.value = false;
        item.value = response.data;
        return response.data;
      }
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return null;
    }
  }

  function setContext(context: any)
  {
    context.value = context;
    localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context));
    return context.value;
  }

  function setContextKey(key: string, value: any)
  {
    if (typeof context.value == 'undefined') {
      context.value = getContext()
    }
    context.value[key] = value;

    //reset currentPage if filters change
    if (key == 'filters' && JSON.stringify(context.value.filters) != JSON.stringify(value)) {
      context.value.currentPage = 1;
    }

    localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context.value));
    return context.value;
  }

  return {
    api,
    availableFields,
    context,
    currentPage,
    defaultContext,
    error,
    exportList,
    isLoading,
    isLoadingWithLock,
    item,
    list,
    listLength,
    localStorageName,
    visibleFields,

    deleteItem,
    find,
    findAll,
    findPage,
    getById,
    getContextKey,
    getNumberOfFilters,
    getVisibleFields,
    hasError,
    hasItems,
    parseArrays,
    parseItem,
    parseSortBy,
    reset,
    resetError,
    save,
    setContext,
    setContextKey,
  }
}
