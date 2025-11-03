import { ItemInterface } from './ItemInterface';

export interface LeadCommentInterface extends ItemInterface {
  comment: string;
  createdAt: Date;
  user?: any;
  lead: string;
  mediaObjects?: any;
}
