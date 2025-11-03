import { ItemInterface } from './ItemInterface';

export interface BusinessSectorInterface extends ItemInterface {
  name?: string;
  readonly stringValue?: string;
}
