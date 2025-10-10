import { Item } from './item';
import { Utilisateur } from './utilisateur';

export interface Setting extends Item {
  context: any;
  isPublic: boolean;
  name: string;
  storageName: string;
  readonly user: Utilisateur;
}
