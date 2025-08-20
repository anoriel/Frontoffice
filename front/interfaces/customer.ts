import { Item } from './item';

export interface Customer extends Item {
  nomSociete?: string;
  customerType?: any;
  tel?: string;
  email?: string;
  reference?: string;
  dateRelance?: Date;
  dateAjout?: Date;
  agency?: any;
  society?: any;
  utilisateur?: any;
  contacts?: any;
  country?: any;
  readonly stringValue?: string;
}
