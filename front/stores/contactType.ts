import { defineStore } from 'pinia'

export const useContacTypeStore = defineStore('contacType', () =>
{
  const list = [
    { id: 'contactAutofac', stringValue: 'contactAutoInvoicing' },
    { id: 'contactDeb', stringValue: 'contactDEG' },
    { id: 'contactFacture', stringValue: 'contactInvoicing' },
    { id: 'contactFiscal', stringValue: 'contactFiscal' },
    { id: 'contactRelance', stringValue: 'contactRecovery' },
  ];


  return {
    list,
  }
})
