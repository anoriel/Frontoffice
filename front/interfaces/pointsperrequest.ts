import { Item } from './item';

export interface PointsPerRequest extends Item {
  uri?: string;
  points?: number;
}
