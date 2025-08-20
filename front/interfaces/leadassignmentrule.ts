import { Item } from './item';

export interface LeadAssignmentRule extends Item {
  user?: any;
  rules?: any;
  priority?: number;
}
