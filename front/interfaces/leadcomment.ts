import { Item } from './item';

export interface LeadComment extends Item {
  comment: string;
  createdAt: Date;
  user?: any;
  lead: string;
  mediaObjects?: any;
}
