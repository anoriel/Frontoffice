export interface MappingType
{
  type?: 'string' | 'boolean' | 'date' | 'object' | 'enum',//mapping type
  object?: string//object type corresponding to the mapping, e.g. agency, society, ...
  enum?: any[] //list of possible enum values, filled only in front end (not from API)
  hidden?: boolean //whether the field is hidden in the list of available fields
  queryPrefix?: string //prefix to use in query for nested objects, e.g. 'contacts' for contact types in customer store
  stringValue?: string //string value to use for translation keys, e.g. 'contactAutoInvoicing' instead of 'contactAutofac'
}
