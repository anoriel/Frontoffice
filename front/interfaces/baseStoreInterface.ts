import { AvailableField } from "./availableField"

export interface BaseStoreInterface {
  api: any,
  availableFields: AvailableField[],
  context: Record<string, any>,
  currentPage: number,
  defaultContext: Record<string, any>,
  isLoading: false,
  isLoadingWithLock: false,
  error: any,
  item: any,
  list: any[],
  listLength: number,
  localStorageName: String,
  visibleFields: AvailableField[],

  hasError(): boolean,
  hasItems(): boolean,

  delete(id: number): boolean,
  findAll(): any,
  find(id: number): any,
  reset(): boolean,
  save(id: number, item: any): any,
  resetError(): void,
}
