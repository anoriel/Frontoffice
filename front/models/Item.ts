import { Item as ItemInterface } from "@/interfaces/ItemInterface";

export default class Item implements ItemInterface
{
  id?: number;
  created_at: Date = new Date(Date.now());
  stringValue?: string;
  '@id'?: string;
  '@type'?: string;
}
