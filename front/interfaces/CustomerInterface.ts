import { ItemInterface } from './ItemInterface';

export interface CustomerInterface extends ItemInterface {
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
