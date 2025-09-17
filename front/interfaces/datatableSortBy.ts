export type OrderBy = "asc" | 'desc'

export interface DatatableSortBy
{
  key: string,
  order: OrderBy,
}
