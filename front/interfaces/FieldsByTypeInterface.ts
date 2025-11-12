import { FieldTypeInterface } from "./FieldTypeInterface";

export interface FieldsByTypeInterface
{
  'boolean'?: string[],
  'count'?: string[],
  'country'?: string[],
  'date'?: string[],
  'datetime'?: string[],
  'float4'?: string[],//to format a number into a float with 4 digits
  'object'?: FieldTypeInterface[],
  'objectsList'?: FieldTypeInterface[],
  'period'?: string[],
  'progressBar'?: FieldTypeInterface[],
  'string'?: string[],
  'stringsList'?: string[],
}
