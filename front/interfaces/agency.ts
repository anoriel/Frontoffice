import { Item } from './item';

export interface Agency extends Item {
  nom?: string;
  active?: boolean;
  pays?: any;
  readonly stringValue?: string;
}
