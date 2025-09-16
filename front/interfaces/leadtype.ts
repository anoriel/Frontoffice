import { Item } from './item';

export interface LeadType extends Item
{
  name: string;
  isHidden: boolean;
  isDefault: boolean;
  position: number;
  readonly stringValue: string;
}
