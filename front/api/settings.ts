import axios from "@/plugins/axios/axios";
import api_base from './api_base';
import merge from 'deepmerge-json';


const thisApi = {
  baseUrl: "/settings",
  findItemsByStorageName(storageName: string)
  {
    return axios.get(`${this.baseUrl}?storageName=${storageName}`);
  },
}

let merged = merge(api_base, thisApi);

export default merged;
