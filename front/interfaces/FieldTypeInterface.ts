import { Store } from "pinia";

export interface FieldTypeInterface
{
  name: string,//name of the field
  store?: Store,//store to get info from
  type: string,//object type to get info
}
