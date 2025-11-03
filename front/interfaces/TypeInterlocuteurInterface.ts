import { ItemInterface } from './ItemInterface';

export interface TypeInterlocuteurInterface extends ItemInterface {
  libelle?: string;
  code?: string;
  visible?: boolean;
}
