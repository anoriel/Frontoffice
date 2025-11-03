import { ItemInterface } from './ItemInterface';

export interface FileIntegrationStatusInterface extends ItemInterface {
  name?: string;
  position?: number;
  description?: string;
  cssClass?: string;
  readonly stringValue?: string;
}
