import axios from "@/plugins/axios/axios";
import api_base from './api_base';
import merge from 'deepmerge-json';


const thisApi = {
  baseUrl: "/agencies",
  findAllActive()
  {
    return axios.get('/agencies?active=true&orderBy[pays.iso3166]=asc&pagination=false');
  },
}

let merged = merge(api_base, thisApi);

export default merged;
