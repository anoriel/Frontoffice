export type OrderBy = "asc" | 'desc'

export interface DatatableSortBy
{
  key: string,
  order: OrderBy,
  property?: string,// used when key is a joined property like 'user.name'
}
