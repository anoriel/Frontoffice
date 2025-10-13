
import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/customers',

  findItemsByType(customerTypeId: number)
  {
    return axios.get(`${this.baseUrl}?customerType.id=${customerTypeId}`);
  },
}

let merged = merge(api_base, thisApi)

export default merged
