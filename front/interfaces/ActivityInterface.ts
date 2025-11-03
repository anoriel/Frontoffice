import { ItemInterface } from './ItemInterface';

export interface ActivityInterface extends ItemInterface {
  douane?: boolean;
  codeText?: any;
  pays?: any;
}
