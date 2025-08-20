export interface MediaObject {
  "@id"?: string;
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
