import { FieldTypeInterface } from "./FieldTypeInterface";

export interface FieldsByTypeInterface
{
  'boolean'?: string[],
  'count'?: string[],
  'country'?: string[],
  'date'?: string[],
  'datetime'?: string[],
  'object'?: FieldTypeInterface[],
  'objectsList'?: FieldTypeInterface[],
  'progressBar'?: FieldTypeInterface[],
  'string'?: string[],
  'stringsList'?: string[],
}
