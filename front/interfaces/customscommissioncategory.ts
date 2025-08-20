import { Item } from './item';

export interface CustomsCommissionCategory extends Item {
  isActive?: boolean;
  readonly customsSubCategories?: any;
  readonly designation?: any;
}
