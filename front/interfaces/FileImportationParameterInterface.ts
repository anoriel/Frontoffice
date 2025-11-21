import { FileHistoryStatusInterface } from "./FileHistoryStatusInterface"
import { FileImportationErrorInterface } from "./FileImportationErrorInterface"
import { FileIntegrationColumnDefinitionInterface } from "./FileIntegrationColumnDefinitionInterface"
import { FileIntegrationValidatedColumnInterface } from "./FileIntegrationValidatedColumnInterface"

export interface FileImportationParameterInterface
{
  "columns": {
    [key: string]: FileIntegrationColumnDefinitionInterface
  },
  "currentImportationLine": number,
  "dataErrorsList": FileImportationErrorInterface[]
  "duplicates": any[]
  "history": {
    "status": FileHistoryStatusInterface[],
  },
  "fileSystem": string,
  "fiscalDateFromColumn": boolean,
  "nbFileImportedRows": number,
  "originalFilename": string,
  "period": Date,
  "validatedColumnsList": {
    [key: string]: FileIntegrationValidatedColumnInterface
  },
}
