import { AvailableField } from "./availableField";

export interface DefaultContext
{
  currentPage: number,
  filters: Record<string, any>,
  sortBy: string,
  sortDesc: boolean,
  sortDirection: string,
  version: string,
  visibleFields: AvailableField[],
}
