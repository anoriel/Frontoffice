import { ItemInterface } from './ItemInterface';

export interface InvoiceConditionInterface extends ItemInterface {
  customer?: any;
  codeText?: any;
  pays?: any;
  readonly stringValue?: string;
}
