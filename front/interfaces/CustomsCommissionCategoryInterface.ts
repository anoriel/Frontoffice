import { ItemInterface } from './ItemInterface';

export interface CustomsCommissionCategoryInterface extends ItemInterface {
  isActive?: boolean;
  readonly customsSubCategories?: any;
  readonly designation?: any;
}
