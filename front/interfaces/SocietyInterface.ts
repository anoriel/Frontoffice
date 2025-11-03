import { ItemInterface } from './ItemInterface';

export interface SocietyInterface extends ItemInterface {
  nom?: string;
  active?: boolean;
  pays?: any;
  readonly stringValue?: string;
}
