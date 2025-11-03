import { ItemInterface } from './ItemInterface';

export interface VatInvoiceInterface extends ItemInterface {
  number?: string;
  invoiceDate?: Date;
  createdAt?: Date;
  currentPeriod?: Date;
  taxFreeAmount?: number;
  currency?: string;
  currencyChangeRate?: number;
  taxAmount?: number;
  VATRate?: number;
  info?: string;
  ARFOperationType?: number;
  ARFLock?: boolean;
  regularization?: boolean;
  refund?: boolean;
  refundDate?: Date;
  refundAnnotation?: string;
  complianceDate?: Date;
  noComplianceDate?: string;
  invoiceCondition?: any;
  customer?: any;
  operationType?: any;
  user?: any;
}
