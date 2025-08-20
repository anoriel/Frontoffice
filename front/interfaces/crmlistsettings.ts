import { Item } from './item';

export interface CrmListSettings extends Item {
  user?: any;
  name?: string;
  context?: any;
  isPublic?: boolean;
  type?: string;
}
