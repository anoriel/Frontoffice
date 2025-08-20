import { Item } from './item';

export interface Activite extends Item {
  douane?: boolean;
  codeText?: any;
  pays?: any;
}
