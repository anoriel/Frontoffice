import { AgencyInterface } from "@/interfaces/AgencyInterface";
import { BusinessSectorInterface } from "@/interfaces/BusinessSectorInterface";
import { CustomerInterface } from "@/interfaces/CustomerInterface";
import { LeadInterface } from "@/interfaces/LeadInterface";
import { LeadCommentInterface } from "@/interfaces/LeadCommentInterface";
import { LeadHistoryInterface } from "@/interfaces/LeadHistoryInterface";
import { LeadOriginInterface } from "@/interfaces/LeadOriginInterface";
import { LeadRefusalReasonInterface } from "@/interfaces/LeadRefusalReasonInterface";
import { LeadTypeInterface } from "@/interfaces/LeadTypeInterface";
import { CountryInterface } from "@/interfaces/CountryInterface";
import { ServiceDomainInterface } from "@/interfaces/ServiceDomainInterface";
import { ServiceTypeInterface } from "@/interfaces/ServiceTypeInterface";
import { SocietyInterface } from "@/interfaces/SocietyInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import Item from "./Item";

export class LeadDTO extends Item implements LeadInterface
{
  public customerName?: string;
  public name?: string;
  public firstname?: string;
  public tel?: string;
  public email?: string;
  public priority?: number;
  public annualExpectedIncome?: number;
  public incomeProbability?: number;
  public customer?: CustomerInterface;
  public countryOfEstablishment?: CountryInterface;
  public countryOfDestination?: CountryInterface;
  public serviceType?: ServiceTypeInterface;
  public serviceDomain?: ServiceDomainInterface;
  public needsDescription: string = '';
  public onNewsletterList?: boolean | null | undefined;
  public rgpdAccepted?: boolean | null | undefined;
  public businessSector?: BusinessSectorInterface;
  public leadType?: LeadTypeInterface;
  public user?: UserInterface;
  public agency?: AgencyInterface;
  public society?: SocietyInterface;
  public leadComments?: LeadCommentInterface;
  public origin?: LeadOriginInterface;
  public address1?: string;
  public address2?: string;
  public city?: string;
  public zipCode?: string;
  public registrationNumber?: string;
  public vatNumber?: string;
  public lastUpdatedAt?: Date;
  public monthlyExpectedIncome?: number;
  public punctualExpectedIncome?: number;
  public reminderDate?: Date;
  public refusalReasons: LeadRefusalReasonInterface[] = [];
  public leadHistories: LeadHistoryInterface[] = [];

  constructor(
    rawData = {
      id: null,
      created: null,
      refusalReasons: [],
      leadHistories: [],
      customerName: null,
      name: null,
      firstname: null,
      tel: null,
      email: null,
      priority: null,
      annualExpectedIncome: null,
      incomeProbability: null,
      customer: null,
      countryOfEstablishment: null,
      countryOfDestination: null,
      serviceType: null,
      serviceDomain: null,
      needsDescription: null,
      onNewsletterList: null,
      rgpdAccepted: null,
      businessSector: null,
      leadType: null,
      user: null,
      agency: null,
      society: null,
      leadComments: null,
      origin: null,
      address1: null,
      address2: null,
      city: null,
      zipCode: null,
      registrationNumber: null,
      vatNumber: null,
      lastUpdatedAt: null,
      monthlyExpectedIncome: null,
      punctualExpectedIncome: null,
      reminderDate: null,
    }
  )
  {
    super();
    Object.keys(rawData).forEach((key: string) =>
    {
      if (key in this) {
        (<any>this)[key] = (<any>rawData)[key];
      }
    });
  }
}
