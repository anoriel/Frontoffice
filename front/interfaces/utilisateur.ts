export interface Utilisateur {
  "@id"?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  actif?: boolean;
  agence?: any;
  societe?: any;
  impersonateUser?: any;
  lastActivityAt?: Date;
  readonly roles?: string;
  readonly stringValue?: string;
  readonly activeNow?: boolean;
  readonly lastPointsPerDate?: any;
  readonly lastPoints?: number;
}
