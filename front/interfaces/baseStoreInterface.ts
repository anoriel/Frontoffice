import { AvailableField } from "./availableField"
import { MappingType } from "./mappingType";

export interface BaseStoreInterface
{
  api: any,
  availableFields: AvailableField[],
  context: Record<string, any>,
  currentPage: number,
  defaultContext: Record<string, any>,
  error: any,
  exportList: any,
  filters: Record<string, any>,
  fieldsByType: any,
  isLoading: false,
  item: any,
  list: any[],
  totalItems: number,
  localStorageName: string,
  mapping: Record<string, MappingType>,//used to generate filter form and parse items
  visibleFields: AvailableField[],

  hasError(): boolean,
  hasItems(): boolean,

  delete(id: number): boolean,
  deleteItem: any,
  find(id: number): any,
  findAll(): any,
  findPage: any,
  getById: any,
  getContextKey: any,
  getNumberOfFilters: any,
  getSearchFilters: any,
  getVisibleFields: any,
  parseArrays: any,
  parseItem: any,
  parseSortBy: any,
  reset(): boolean,
  resetError(): void,
  save(id: number, item: any): any,
  setContext: any,
  setContextKey: any,
  setVisibleFields: any,
}
