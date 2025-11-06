import { LeadOriginInterface } from "@/interfaces/LeadOriginInterface";
import Item from "./Item";

export class LeadOriginDTO extends Item implements LeadOriginInterface
{
  name: string = "ajout manuel";
  isDeleted: boolean = false;

  constructor(
    rawData: LeadOriginInterface = {
      id: 4,
      name: "ajout manuel",
      isDeleted: false,
      stringValue: "ajout manuel",
      "@id": "/api/lead_origins/4",
      "@type": "LeadOrigin",
    }
  )
  {
    super();
    Object.assign(this, rawData);
  }
}
