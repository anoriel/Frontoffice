export interface BaseStoreInterface {
  api: any,
  currentPage: number,
  isLoading: false,
  error: any,
  item: any,
  list: any[],
  listLength: number,

  hasError(): boolean,
  hasItems(): boolean,

  delete(id: number): boolean,
  findAll(): any,
  find(id: number): any,
  reset(): boolean,
  save(id: number, item: any): any,
  resetError(): void,
}
