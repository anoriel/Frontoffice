import { Item } from './item';

export interface Pays extends Item {
  nom: string;
  iso3166: string;
  langue: string;
  readonly stringValue: string;
}
