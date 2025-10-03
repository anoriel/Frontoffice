export interface MappingType
{
  type: 'string' | 'boolean' | 'date' | 'object',//type du champs
  object?: string//le type d'object correspondant au mapping, ex:agency, society, ...
}
