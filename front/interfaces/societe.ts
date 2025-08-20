import { Item } from './item';

export interface Societe extends Item {
  nom?: string;
  active?: boolean;
  pays?: any;
  readonly stringValue?: string;
}
