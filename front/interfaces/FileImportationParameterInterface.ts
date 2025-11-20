import { FileHistoryStatusInterface } from "./FileHistoryStatusInterface"
import { FileImportationErrorInterface } from "./FileImportationErrorInterface"
import { FileIntegrationColumnDefinitionInterface } from "./FileIntegrationColumnDefinitionInterface"
import { FileIntegrationValidatedColumnInterface } from "./FileIntegrationValidatedColumnInterface"

export interface FileImportationParameterInterface
{
  "history": {
    "status": FileHistoryStatusInterface[],
  },
  "originalFilename": string,
  "fileSystem": string,
  "fiscalDateFromColumn": boolean,
  "period": Date,
  "columns": {
    [key: string]: FileIntegrationColumnDefinitionInterface
  },
  "validatedColumnsList": {
    [key: string]: FileIntegrationValidatedColumnInterface
  },
  "currentImportationLine": number,
  "dataErrorsList": FileImportationErrorInterface[]
}
