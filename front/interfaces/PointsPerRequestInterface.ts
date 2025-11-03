import { ItemInterface } from './ItemInterface';

export interface PointsPerRequestInterface extends ItemInterface {
  uri?: string;
  points?: number;
}
