import { Item } from './item';

export interface Designation extends Item {
  readonly?: boolean;
  codeText?: any;
  pos?: number;
  activite?: any;
  customsCategories?: any;
}
