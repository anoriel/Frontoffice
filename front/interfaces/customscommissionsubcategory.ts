import { Item } from './item';

export interface CustomsCommissionSubCategory extends Item {
  isActive?: boolean;
  readonly category?: any;
  readonly designationProperty?: any;
}
