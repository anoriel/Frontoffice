
import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/customers',

  findByName(name: string, customerTypes: number[] = [1001])
  {
    if (!name || name.length < 3) {
      return [];
    }
    name = encodeURIComponent(name);
    let url = `${this.baseUrl}?orderBy[nomSociete]=asc&nomSociete=${name}`
    for (let i in customerTypes) {
      let type = customerTypes[i];
      url += `&customerType.id[]=${type}`;
    }
    return axios.get(url);
  },
  findItemsByType(customerTypeId: number)
  {
    return axios.get(`${this.baseUrl}?customerType.id=${customerTypeId}`);
  },
}

let merged = merge(api_base, thisApi)

export default merged
