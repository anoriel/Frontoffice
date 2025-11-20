import { FileImportationContentColumnCorrespondenceInterface } from "./FileImportationContentColumnCorrespondenceInterface.ts"

export interface FileIntegrationColumnDefinitionInterface
{
  "probability": number,
  "reliabilityScore": number,
  "columnCorrespondence": number,
  "columnCorrespondenceName": string,
  "headerProbability": number,
  "name": string,
  "expectedColumnId": number,
  "contentColumnCorrespondence": FileImportationContentColumnCorrespondenceInterface[],
  "formats": {
    [key: string]: any;
  }
}
