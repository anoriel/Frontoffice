import { Store } from "pinia";

export interface FieldType
{
  name: string,//name of the field
  store?: Store,//store to get info from
  type: string,//object type to get info
}
