import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'
import { CustomerInterface } from "@/interfaces/CustomerInterface";

const thisApi = {
  baseUrl: '/invoice_conditions',

  findByParent(customer: CustomerInterface, language: string = 'fr')
  {
    return axios.get(`${this.baseUrl}?codeText.texteMultis.langage.codeIso=${language}&active=1&customer.id=${customer.id}`);
  }
}

let merged = merge(api_base, thisApi)

export default merged
