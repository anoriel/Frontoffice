import { Item } from './item';

export interface LeadHistory extends Item
{
  createdAt: Date;
  user?: any;
  lead: string;
  newValue?: string;
  oldValue?: string;
  onlyNewValue: boolean;
  updatedField: string;
}
