export interface Interlocuteur {
  "@id"?: string;
  civilite?: string;
  nom?: string;
  prenom?: string;
  tel?: string;
  email?: string;
  contactDeb?: boolean;
  contactFiscal?: boolean;
  contactFacture?: boolean;
  contactAutofac?: boolean;
  contactRelance?: boolean;
  keynews?: boolean;
  mailingList?: boolean;
  typeInterlocuteur?: any;
  readonly stringValue?: string;
}
