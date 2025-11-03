import { ItemInterface } from './ItemInterface';

export interface LeadRefusalReasonInterface extends ItemInterface {
  name?: string;
  isDeleted?: boolean;
  readonly stringValue?: string;
}
