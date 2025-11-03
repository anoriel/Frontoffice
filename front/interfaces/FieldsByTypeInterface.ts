import { FieldType } from "./FieldTypeInterface";

export interface FieldsByTypeInterface
{
  'boolean'?: string[],
  'count'?: string[],
  'country'?: string[],
  'date'?: string[],
  'datetime'?: string[],
  'object'?: FieldType[],
  'objectsList'?: FieldType[],
  'progressBar'?: FieldType[],
  'string'?: string[],
  'stringsList'?: string[],
}
