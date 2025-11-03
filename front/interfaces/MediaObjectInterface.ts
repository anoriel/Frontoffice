import { ItemInterface } from './ItemInterface';

export interface MediaObjectInterface extends ItemInterface {
  filename?: string;
  mimeType?: string;
  filesystem?: string;
  directory?: string;
  fileURL: string;
  category?: string;
  createdAt?: Date;
  leadComments?: string[];
  size?: number;
  clientOriginalName: string;
}
