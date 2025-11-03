import { ItemInterface } from './ItemInterface';

export interface AgencyInterface extends ItemInterface {
  nom?: string;
  active?: boolean;
  pays?: any;
  readonly stringValue?: string;
}
