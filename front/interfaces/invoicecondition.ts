import { Item } from './item';

export interface InvoiceCondition extends Item {
  customer?: any;
  codeText?: any;
  pays?: any;
  readonly stringValue?: string;
}
