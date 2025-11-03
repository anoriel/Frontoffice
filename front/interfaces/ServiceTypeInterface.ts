import { ItemInterface } from './ItemInterface';

export interface ServiceTypeInterface extends ItemInterface {
  name?: string;
  readonly stringValue?: string;
}
