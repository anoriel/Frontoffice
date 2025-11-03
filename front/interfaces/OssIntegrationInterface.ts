import { ItemInterface } from './ItemInterface';

export interface OssIntegrationInterface extends ItemInterface {
  customer?: string;
  invoiceConditions?: string;
  user?: string;
  createdAt?: Date;
  uniqueId?: string;
  filepath?: string;
  status?: string;
  deleted?: boolean;
  messages?: any;
  importationParameters?: any;
  overview?: any;
  columnsTemplate?: any;
  importationParameterByKey?: string;
  readonly transactions?: any;
}
