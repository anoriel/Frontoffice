import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const DEFAULT_CUSTOMER_TYPES: Record<string, number> = {
  "prospect": 1000,
  "customer": 1001
};

const thisApi = {
  baseUrl: '/customer_types',
  findAll()
  {
    let url = `${this.baseUrl}?pagination=false&`;
    Object.keys(DEFAULT_CUSTOMER_TYPES).forEach(key =>
    {
      url += "&id[]=" + DEFAULT_CUSTOMER_TYPES[key];
    });
    return axios.get(url);
  },
}

let merged = merge(api_base, thisApi)

export default merged
