import { ItemInterface } from './ItemInterface';

export interface CountryInterface extends ItemInterface {
  nom: string;
  iso3166: string;
  langue: string;
  readonly stringValue: string;
}
