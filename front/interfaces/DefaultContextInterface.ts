import { AvailableFieldInterface } from "./AvailableFieldInterface";
import { DatatableSortByInterface } from "./DatatableSortByInterface";

export interface DefaultContextInterface
{
  currentPage: number,
  filters: Record<string, any>,
  sortBy: DatatableSortByInterface,
  version: string,
  visibleFields: AvailableFieldInterface[],
}
