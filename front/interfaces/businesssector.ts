import { Item } from './item';

export interface BusinessSector extends Item {
  name?: string;
  readonly stringValue?: string;
}
