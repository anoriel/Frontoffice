import { ItemInterface } from './ItemInterface';

export interface DesignationInterface extends ItemInterface {
  readonly?: boolean;
  codeText?: any;
  pos?: number;
  activite?: any;
  customsCategories?: any;
}
