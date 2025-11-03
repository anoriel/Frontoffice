import { ItemInterface } from './ItemInterface';

export interface LeadAssignmentRuleInterface extends ItemInterface {
  user?: any;
  rules?: any;
  priority?: number;
}
