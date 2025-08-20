import { Item } from './item';

export interface CustomerType extends Item {
  libelle?: string;
  code?: string;
  readonly stringValue?: string;
}
