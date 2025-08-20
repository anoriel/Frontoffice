import { Item } from './item';

export interface OperationType extends Item {
  label?: string;
  code?: string;
}
