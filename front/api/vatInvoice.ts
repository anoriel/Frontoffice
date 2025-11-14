import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'
import _ from "lodash";
import { FilterArrayItemInterface } from "@/interfaces/FilterArrayItemInterface";

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
    let invoiceCondition = filtersArray.find((e: FilterArrayItemInterface) => { return e.key == 'invoiceConditionId' });
    if (invoiceCondition === undefined) {
      return [];
    }
    let id = invoiceCondition.value;
    let url = `vat/getByInvoiceCondition/${id}?`;
    filtersArray.push({ key: "page", value: page });
    filtersArray.push({ key: "itemsPerPage", value: perPage });
    filtersArray.push({ key: "orderBy", value: orderBy });
    url += this.getArrayFilters(filtersArray).join("&");
    return axios.get(url);
  },
  getPageCount(filtersArray?: any)
  {
    let invoiceCondition = filtersArray.find((e: FilterArrayItemInterface) => { return e.key == 'invoiceConditionId' });
    if (invoiceCondition === undefined) {
      return 0;
    }
    let id = invoiceCondition.value;
    let url = `vat/getCountByInvoiceCondition/${id}?`;
    url += this.getArrayFilters(filtersArray).join("&");
    return axios.get(url);
  },

  getArrayFilters(filtersArray: FilterArrayItemInterface[])
  {
    let arrayFilters: any[] = [];
    filtersArray.forEach((element) =>
    {
      if (element.key == 'invoiceConditionId') return;

      arrayFilters.push(element.key + "=" + element.value);
    });
    return arrayFilters;
  }
}

let merged = merge(api_base, thisApi)

export default merged
