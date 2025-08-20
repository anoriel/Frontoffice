import { Item } from './item';

export interface MimeType extends Item {
  name?: string;
  MIMEType?: string;
  extension?: string;
  description?: string;
  mIMEType?: string;
}
