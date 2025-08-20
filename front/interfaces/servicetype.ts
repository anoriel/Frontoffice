import { Item } from './item';

export interface ServiceType extends Item {
  name?: string;
  readonly stringValue?: string;
}
