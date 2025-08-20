import { Item } from './item';

export interface LeadRefusalReason extends Item {
  name?: string;
  isDeleted?: boolean;
  readonly stringValue?: string;
}
