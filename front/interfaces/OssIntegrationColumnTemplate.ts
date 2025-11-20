import { FileIntegrationColumnInterface } from './FileIntegrationColumnInterface';

export interface OssIntegrationColumnTemplate
{
  "@id": string,
  "@type": string,
  "id": number,
  "name": string,
  "fileIntegrationColumns": FileIntegrationColumnInterface[]
}
