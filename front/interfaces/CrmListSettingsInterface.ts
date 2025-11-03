import { ItemInterface } from './ItemInterface';

export interface CrmListSettingsInterface extends ItemInterface {
  user?: any;
  name?: string;
  context?: any;
  isPublic?: boolean;
  type?: string;
}
