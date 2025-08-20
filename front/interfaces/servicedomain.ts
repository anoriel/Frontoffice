import { Item } from './item';

export interface ServiceDomain extends Item {
  name?: string;
  readonly stringValue?: string;
}
