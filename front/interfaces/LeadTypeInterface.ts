import { ItemInterface } from './ItemInterface';

export interface LeadTypeInterface extends ItemInterface
{
  name: string;
  isHidden: boolean;
  isDefault: boolean;
  position: number;
  readonly stringValue: string;
}
