import { FieldType } from "./fieldType";

export interface FieldsByType
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
