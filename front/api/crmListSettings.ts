import axios from "@/plugins/axios/axios";
import api_base from './api_base';
import merge from 'deepmerge-json';


const thisApi = {
  baseUrl: "/crm_list_settings",
  findItemsByType(type: string)
  {
    return axios.get(`${this.baseUrl}?type=${type}`);
  },
}

let merged = merge(api_base, thisApi);

export default merged;
