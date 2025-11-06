import { CustomerInterface } from './CustomerInterface';
import { ItemInterface } from './ItemInterface';

export interface LeadInterface extends ItemInterface
{
  createdAt?: Date;
  customerName?: string;
  name?: string;
  firstname?: string;
  tel?: string;
  email?: string;
  priority?: number;
  annualExpectedIncome?: number;
  incomeProbability?: number;
  customer?: CustomerInterface | null;
  countryOfEstablishment?: any;
  countryOfDestination?: any;
  serviceType?: any;
  serviceDomain?: any;
  needsDescription?: string;
  onNewsletterList?: boolean | null | undefined;
  rgpdAccepted?: boolean | null | undefined;
  businessSector?: any;
  leadType?: any;
  user?: any;
  refusalReasons?: any;
  agency?: any;
  society?: any;
  leadComments?: any;
  origin?: any;
  address1?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  registrationNumber?: string;
  vatNumber?: string;
  lastUpdatedAt?: Date;
  monthlyExpectedIncome?: number;
  punctualExpectedIncome?: number;
  reminderDate?: Date;
  leadHistories?: any;


  [key: string]: any;
}
