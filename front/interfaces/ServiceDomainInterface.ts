import { ItemInterface } from './ItemInterface';

export interface ServiceDomainInterface extends ItemInterface {
  name?: string;
  readonly stringValue?: string;
}
