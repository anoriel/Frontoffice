import { ItemInterface } from './ItemInterface';

export interface LeadOriginInterface extends ItemInterface {
  name?: string;
  isDeleted?: boolean;
  readonly stringValue?: string;
}
