import { ItemInterface } from './ItemInterface';

export interface CustomerTypeInterface extends ItemInterface {
  libelle?: string;
  code?: string;
  readonly stringValue?: string;
}
