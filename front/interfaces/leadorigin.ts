import { Item } from './item';

export interface LeadOrigin extends Item {
  name?: string;
  isDeleted?: boolean;
  readonly stringValue?: string;
}
