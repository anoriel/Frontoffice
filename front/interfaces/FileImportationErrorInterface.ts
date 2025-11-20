export interface FileImportationErrorInterface
{
  "foundValue": string,
  "errorMessage": string,
  "previousMessage": null,
  "errorParameters": [
    string,
    string
  ],
  "column": number,
  "rows": number[],
  "expectedField": string,
  "possibleValues": string[],
  "replacementValue"?: any,
  "validated": boolean
}
