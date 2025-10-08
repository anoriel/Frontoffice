import { AvailableField } from "./availableField";
import { DatatableSortBy } from "./datatableSortBy";

export interface DefaultContext
{
  currentPage: number,
  filters: Record<string, any>,
  sortBy: DatatableSortBy,
  version: string,
  visibleFields: AvailableField[],
}
