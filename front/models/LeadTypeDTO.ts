import Item from "./Item";
import { LeadTypeInterface } from "@/interfaces/LeadTypeInterface";

export class LeadTypeDTO extends Item implements LeadTypeInterface
{
  name: string = "undefined";
  isHidden: boolean = false;
  isDefault: boolean = false;
  position: number = 1;
  readonly stringValue: string = this.name;

  constructor(
    rawData: LeadTypeInterface = {
      id: 1,
      name: "undefined",
      isHidden: false,
      isDefault: true,
      position: 1,
      stringValue: "undefined"
    }
  )
  {
    super();
    Object.assign(this, rawData);
  }
}
