import { ItemInterface } from './ItemInterface';

export interface MimeTypeInterface extends ItemInterface {
  name?: string;
  MIMEType?: string;
  extension?: string;
  description?: string;
  mIMEType?: string;
}
