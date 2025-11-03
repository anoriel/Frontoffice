import { ItemInterface } from './ItemInterface';

export interface CustomsCommissionSubCategoryInterface extends ItemInterface {
  isActive?: boolean;
  readonly category?: any;
  readonly designationProperty?: any;
}
