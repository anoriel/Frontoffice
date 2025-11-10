import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/vat_invoices',
  findAll()
  {
    return axios.get(
      `${this.baseUrl}?orderBy[id]=desc&pagination=true`
    );
  },
  findPage(page: number, perPage: number, orderBy: string, _orderSort: string, filtersArray: any)
  {
    let invoiceConditionId = filtersArray['invoiceConditionId'];
    if (invoiceConditionId === undefined) {
      return [];
    }
    let url = `vat/getByInvoiceCondition/${invoiceConditionId}?`;
    if (page) {
      filtersArray["page"] = page;
    }
    if (perPage) {
      filtersArray["perPage"] = perPage;
    }
    filtersArray["orderBy"] = orderBy;
    url += this.getArrayFilters(filtersArray).join("&");
    return axios.get(url);
  },
  getPageCount(filtersArray?: any)
  {
    let invoiceConditionId = filtersArray['invoiceConditionId'];
    if (invoiceConditionId === undefined) {
      return 0;
    }
    let url = "/vat/getCountByInvoiceCondition/" + invoiceConditionId + "?";
    url += this.getArrayFilters(filtersArray).join("&");
    return axios.get(url);
  },

  getArrayFilters(filtersArray?: any)
  {

    let arrayFilters: any[] = [];
    Object.keys(filtersArray).forEach(element =>
    {
      if (element == 'invoiceConditionId') return;
      if (filtersArray[element] != null && (typeof filtersArray[element] === 'object' || Array.isArray(filtersArray[element])) && 'id' in filtersArray[element]) {
        arrayFilters.push(element + "=" + filtersArray[element]['id']);
      }
      else if (filtersArray[element] != null && filtersArray[element].length) {
        arrayFilters.push(element + "=" + encodeURIComponent(filtersArray[element]));
      }
    });
    return arrayFilters;
  }
}

let merged = merge(api_base, thisApi)

export default merged
