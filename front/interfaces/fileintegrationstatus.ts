import { Item } from './item';

export interface FileIntegrationStatus extends Item {
  name?: string;
  position?: number;
  description?: string;
  cssClass?: string;
  readonly stringValue?: string;
}
