import { ItemInterface } from './ItemInterface';
import { UserInterface } from './UserInterface';

export interface SettingInterface extends ItemInterface {
  context: any;
  isPublic: boolean;
  name: string;
  storageName: string;
  readonly user: UserInterface;
}
