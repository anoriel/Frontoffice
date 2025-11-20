import { CustomerInterface } from './CustomerInterface';
import { OssIntegrationColumnTemplate } from './OssIntegrationColumnTemplate.ts';
import { FileIntegrationStatusInterface } from './FileIntegrationStatusInterface';
import { InvoiceConditionInterface } from './InvoiceconditionInterface';
import { ItemInterface } from './ItemInterface';
import { UserInterface } from './UserInterface';
import { FileImportationParameterInterface } from './FileImportationParameterInterface.ts';

export interface OssIntegrationInterface extends ItemInterface
{
  customer?: CustomerInterface;
  invoiceConditions?: InvoiceConditionInterface;
  user?: UserInterface;
  createdAt?: Date;
  uniqueId?: string;
  filepath?: string;
  status?: FileIntegrationStatusInterface;
  deleted?: boolean;
  messages?: any;
  importationParameters?: FileImportationParameterInterface;
  overview?: any;
  columnsTemplate?: OssIntegrationColumnTemplate;
  importationParameterByKey?: string;
  readonly transactions?: any;
}
