export interface AvailableFieldInterface
{
  key: string,//field name
  fieldType?: string,//field type, ex:string, date, boolean, object, objectsList, progressBar
  filterableOnExistance?: boolean,//can we filter when this filed exists or not, ex:exists[agency] pour un lead
  items?: any[],//items list shown in integrations headers to select correct column
  property?: string,//entity (model, interface, ...) for the selected field
  sortable?: boolean,//can we sort this field
  sortProperty?: string//field name to sort
  title?: string,//field title
  value?: any,//field value (can be used in integrations with object type)
  warning?: boolean,
}
