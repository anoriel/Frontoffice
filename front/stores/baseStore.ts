import { computed, ref } from "vue"
import api_base from '@/api/api_base';
import { Item } from '@/interfaces/item';
import useCommonHelper from '../helpers/commonHelper'
import { DatatableSortBy } from "@/interfaces/datatableSortBy";
import { AvailableField } from "@/interfaces/availableField";
import { FieldsByType } from "@/interfaces/fieldsByType";
import { IriTemplateMapping } from "@/interfaces/iriTemplateMapping";
import { isArray, isObject } from "lodash";
import { DefaultContext } from "@/interfaces/defaultContext";
import { MappingType } from "@/interfaces/mappingType";
import moment from "moment";
const helpers = useCommonHelper()




export function useBaseStore()
{
  const api = ref(api_base)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const error = ref(null)
  const item = ref(null as Item | null)
  const list = ref([] as Item[])
  const listLength = ref(0)


  const availableFields = ref<AvailableField[]>([])
  const fieldsByType = ref<FieldsByType>({//used to display value inside data table, or format input in forms for filters component
    'boolean': [],//will display a switch for boolean value or a check/close/? icon
    'count': [],//will display a number in data table, a list in forms
    'date': [],//will display a date in data table, start/end date calendar in forms
    'datetime': [],//will display a datetime in data table, start/end datetime calendar in forms
    'object': [],//will display specific template for this object in data table, a specific multiple select box in forms (ex: agency, society, country, ...)
    'objectsList': [],//will display specific template for this object(s) in data table, a specific multiple select box in forms (ex: agency, society, country, ...)
    'progressBar': [],//will display progress bar in data table, a simple select box in forms
    'string': [],//will display string value in data table, a multiple select box in forms
    'stringsList': [],//will display string value(s) in data table, a multiple select box in forms
  })
  const context = ref<Record<string, any>>({})
  const defaultContext = ref<DefaultContext>({
    currentPage: 1,
    filters: {},
    sortBy: { key: 'id', order: 'asc' } as DatatableSortBy,
    version: '0.0',
    visibleFields: [],
  })
  const filters = ref<Record<string, any>>([])
  const orderByList = ref<Record<string, string>>({})
  const mapping = ref<Record<string, MappingType>>({})//list of sortable properties with their key name (ex: leadType.name))
  const localStorageName = ref("base")
  const visibleFields = ref<AvailableField[]>([])

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
    } catch (err: any) {
      isLoading.value = false;
      error.value = err;
      return false;
    }
  }

  async function exportList(sortBy: DatatableSortBy, filters: Record<string, MappingType>, properties: AvailableField[])
  {
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
    let isNullArray = parsed[1];
    let isNotNullArray = parsed[2];

    error.value = null;
    try {
      let response = await api.value.export(sortBy.key, sortBy.order, filtersArray, isNullArray, isNotNullArray, properties);
      return response.data;
    } catch (error: any) {
      error.value = error.data
      return null;
    }
  }

  async function findAll(showFullData: boolean = false)
  {
    isLoading.value = true;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    try {
      let response = await api.value.findAll(showFullData);
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

  async function findPage(page: number, perPage: number, sortBy: DatatableSortBy, filters: any)
  {
    let parsed = parseArrays(filters);
    let filtersArray = parsed[0];
    let isNullArray = parsed[1];
    let isNotNullArray = parsed[2];

    setContextKey('currentPage', page);

    isLoading.value = true;
    error.value = null;
    list.value = [];
    listLength.value = 0;
    try {
      let response = await api.value.findPage(page, perPage, sortBy.property ?? sortBy.key, sortBy.order, filtersArray, isNullArray, isNotNullArray);
      isLoading.value = false;
      list.value = response.data["member"];
      listLength.value = response.data["totalItems"];

      if (typeof response.data != 'undefined' && "search" in response.data && "mapping" in response.data['search']) {
        let keyToIgnore = ['id'];

        //we scan the mapping to see if the fields are sortable and get the name of the filterable field (ex: businessSector.name)
        let responseMapping: IriTemplateMapping[] = response.data['search']['mapping'];

        //we add fields of type "type:xxx" in the mapping
        //ex: type:customerName -> mapping['customerName'] = {type: 'string'}
        //ex: type:object:agency -> mapping['agency'] = {type: 'object', object: 'agency'}
        //we also initialize the default filters to null (or [] for objects) and add them to the default context
        const typeRegexList = [/type:.*/];
        const isObjectRegexList = [/object:.*/];
        responseMapping.filter(function (element: IriTemplateMapping)
        {
          return typeRegexList.some(rx => rx.test(element.variable));
        }).forEach((element: IriTemplateMapping) =>
        {
          let variable = element.variable.replace('type:', '');

          //if the mapping already exists, we ignore
          if (variable in mapping.value) {
            return;
          }

          let mappingType = { type: element.property } as MappingType;
          let searchValue = null;
          if (isObjectRegexList.some(rx => rx.test(element.property))) {
            mappingType = { type: 'object', object: element.property.replace('object:', '') } as MappingType;
            searchValue = [];
          }

          mapping.value[variable] = mappingType;

          defaultContext.value.filters[variable] = searchValue;
        });

        //we get the list of fields from the first item of the list
        let fields = Object.keys(list.value[0]).filter(function (e)
        {
          //we only take fields that are arrays or objects with a stringValue field or that are strings and do not start with @ (ex: @id, @type)
          if ((e && typeof e === "object" && "stringValue" in e) || (typeof e === "string" && e[0] !== "@")) {
            return true;
          }
          return false;
        });

        //if availableFields or mapping are empty, we fill them
        if (availableFields.value.length == 0 || Object.keys(mapping.value).length == 0) {


          //we scan the field headers of the response
          for (let i in fields) {
            let field = fields[i];
            if (keyToIgnore.includes(field)) {//we ignore fields that are not in the mapping
              continue;
            }
            //we look in the mapping if the field is sortable and get the name of the property to sort on
            let foundSortableValue = responseMapping.find(function (el: IriTemplateMapping) { return el.variable.startsWith('orderBy') && el.property.startsWith(field); });
            if (foundSortableValue != undefined) {
              orderByList.value[field] = foundSortableValue.property;
            }
            //we look in the mapping if the field is filterable on its existance
            let foundFilterableOnExistance = responseMapping.find((el: IriTemplateMapping) => el.variable == "exists[${field}]" && el.property == field);
            //we determine the type of the field
            let fieldType = 'string';
            if (fieldsByType.value.boolean?.includes(field)) {
              fieldType = "boolean";
            } else if (fieldsByType.value.date?.includes(field) || fieldsByType.value.date?.includes(field)) {
              fieldType = "date";
            } else if (fieldsByType.value.object?.find((e: any) => e.name == field) || fieldsByType.value.objectsList?.find((e: any) => e.name == field) || fieldsByType.value.progressBar?.find((e: any) => e.name == field)) {
              fieldType = "object";
            }
            let availableField: AvailableField = {
              'key': field,
              'sortable': foundSortableValue != undefined,
              'sortProperty': foundSortableValue?.property,
              'fieldType': fieldType,
              'filterableOnExistance': foundFilterableOnExistance != undefined
            };
            availableFields.value.push(availableField);

            //if visibleFields exists for this field, we update it with the new properties (sortable, sortProperty, filterableOnExistance)
            let visibleFieldIndex = visibleFields.value.findIndex(vf => vf.key == field);
            if (visibleFieldIndex > -1) {
              visibleFields.value[visibleFieldIndex] = availableField;
            }
          }
        }
      }

      if (!('property' in sortBy) || sortBy.property == null) {//we set the property if not set
        let foundVisibleField = availableFields.value.find(function (el) { return el.key == sortBy.key });
        if (foundVisibleField) {
          sortBy.property = foundVisibleField.sortProperty
        }

      }
      setContextKey('sortBy', sortBy);
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

  function getContextKey(key: string, fromDefaultValue = false)
  {
    //check if context exists
    getContext()

    if (fromDefaultValue && key != null) {
      return JSON.parse(JSON.stringify((defaultContext.value as any)[key]));
    } else if (key != null && typeof context.value[key] == 'undefined' && typeof (defaultContext.value as any)[key] != 'undefined') {
      context.value[key] = JSON.parse(JSON.stringify((defaultContext.value as any)[key]));
      localStorage.setItem(localStorageName.value + ".context", JSON.stringify(context.value));
    } else if (key != null && typeof (defaultContext.value as any)[key] == 'undefined') {
      console.log(key);
    }

    return context.value[key];
  }

  function getFiltersDiff()
  {
    if (typeof context.value == 'undefined' || typeof context.value.filters == 'undefined') {
      console.log("No filters in context");
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

  function getOrderBy(reset: boolean = false): DatatableSortBy[]
  {
    let sortBy = getContextKey("sortBy", reset)
    //we check the sortBy field by its property, as the DataTable component needs the sortBy key, not the sortProperty
    let foundVisibleField = availableFields.value.find(function (el) { return el.sortProperty == sortBy.key });
    if (foundVisibleField) {
      sortBy.property = foundVisibleField.key
    }

    return [sortBy as DatatableSortBy];
  }

  function getSearchFilters(reset: boolean = false)
  {
    if (Object.keys(filters.value).length == 0 || reset) {
      filters.value = getContextKey("filters", reset);
    }
    return filters.value;
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

  interface FilterArrayItem
  {
    key: string;
    value: any;
  }

  let filtersArray: FilterArrayItem[] = [];
  let isNullArray: string[] = [];
  let isNotNullArray: string[] = [];
  function parseArrays(filters: any): [FilterArrayItem[], string[], string[]]
  {
    filtersArray = [];
    isNullArray = [];
    isNotNullArray = [];
    Object.entries(filters).forEach(([key, value]) =>
    {
      if (value != null) {
        if (!isArray(value)) {//single value
          parseData(key, value);
        } else {//array of values
          if (moment.isDate(value)) {//date or datetime range
            if (value.length == 1) {//only one date
              filtersArray.push({
                'key': key,
                'value': helpers.formatDate(value[0])
              });
            } else if (value.length >= 2) {//date range
              //we take the first and last value of the array
              value.sort((a: Date, b: Date) => a.getTime() - b.getTime());
              //we push the after and before filters
              filtersArray.push({
                'key': key + '[after]',
                'value': helpers.formatDate(value[0])
              });
              filtersArray.push({
                'key': key + '[before]',
                'value': helpers.formatDate(value.pop())
              });
            }
          } else {//list of values
            for (let j in value) {
              let subFilter = value[j];
              parseData(key, subFilter);
            }
          }
        }
      } else {
        console.log("Unknown mapping for filter " + key + " with value ", value);
      }
    });
    return [filtersArray, isNullArray, isNotNullArray];
  }

  function parseData(key: string, value: any)
  {
    let stringValue = value;
    if (isObject(value) && 'id' in value) {
      stringValue = value['id'];
    }

    if (stringValue == -1) {
      isNullArray.push(key);
    }
    else if (stringValue == 0) {
      isNotNullArray.push(key);
    }
    else {
      filtersArray.push({
        'key': key + '[]',
        'value': stringValue
      });
    }
  }

  function parseItem(item: any)
  {
    return item;
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

  function setSearchFilters(searchFilters: Record<string, any>)
  {
    filters.value = searchFilters;
    return setContextKey("filters", filters.value);
  }

  function setVisibleFields(fields: AvailableField[])
  {
    visibleFields.value = fields;

    return setContextKey('visibleFields', visibleFields.value)
  }

  return {
    api,
    availableFields,
    context,
    currentPage,
    defaultContext,
    error,
    exportList,
    fieldsByType,
    filters,
    isLoading,
    item,
    list,
    listLength,
    localStorageName,
    mapping,
    visibleFields,

    deleteItem,
    find,
    findAll,
    findPage,
    getById,
    getContextKey,
    getNumberOfFilters,
    getOrderBy,
    getSearchFilters,
    getVisibleFields,
    hasError,
    hasItems,
    parseArrays,
    parseItem,
    reset,
    resetError,
    save,
    setContext,
    setContextKey,
    setSearchFilters,
    setVisibleFields,
  }
}
