import { Item } from './item';

export interface MediaObject extends Item {
  filename?: string;
  mimeType?: string;
  filesystem?: string;
  directory?: string;
  fileURL?: string;
  category?: string;
  createdAt?: Date;
  leadComments?: string[];
  size?: number;
  clientOriginalName?: string;
}
