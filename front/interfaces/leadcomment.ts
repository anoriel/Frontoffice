import { Item } from './item';

export interface LeadComment extends Item {
  comment?: string;
  createdAt?: Date;
  user?: any;
  lead?: string;
  attachedFile?: any;
  filePath?: string;
  mediaObjects?: any;
}
