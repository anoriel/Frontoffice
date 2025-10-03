export interface AvailableField
{
  key: string,//nom du champ
  fieldType?: string,//type du champ, ex:string, date, boolean, object, objectsList, progressBar
  filterableOnExistance?: boolean,//peut-on filtrer sur l'existance ou non de ce champ, ex:exists[agency] pour un lead
  sortable?: boolean,//peut-on trier sur ce champ
  property?: string,//la propriété de l'entité sur laquelle on filtre
  sortProperty?: string//la propriété de l'entité sur laquelle on trie
}
