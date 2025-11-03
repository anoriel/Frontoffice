import { ItemInterface } from './ItemInterface';

export interface LeadHistoryInterface extends ItemInterface
{
  createdAt: Date;
  user?: any;
  lead: string;
  newValue?: string;
  oldValue?: string;
  onlyNewValue: boolean;
  updatedField: string;
}
