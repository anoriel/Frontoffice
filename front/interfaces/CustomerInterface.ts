import { AgencyInterface } from './AgencyInterface';
import { CountryInterface } from './CountryInterface';
import { CustomerTypeInterface } from './CustomerTypeInterface';
import { InterlocuteurInterface } from './InterlocuteurInterface';
import { ItemInterface } from './ItemInterface';
import { SocietyInterface } from './SocietyInterface';
import { UserInterface } from './UserInterface';

export interface CustomerInterface extends ItemInterface
{
  nomSociete?: string;
  customerType?: CustomerTypeInterface | null;
  tel?: string;
  email?: string;
  reference?: string;
  dateRelance?: Date;
  dateAjout?: Date;
  agency?: AgencyInterface | null;
  society?: SocietyInterface | null;
  utilisateur?: UserInterface | null;
  contacts?: InterlocuteurInterface[];
  country?: CountryInterface | null;
  readonly stringValue?: string;
}
