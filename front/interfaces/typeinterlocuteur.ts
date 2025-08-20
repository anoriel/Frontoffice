import { Item } from './item';

export interface TypeInterlocuteur extends Item {
  libelle?: string;
  code?: string;
  visible?: boolean;
}
