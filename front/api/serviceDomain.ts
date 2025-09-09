import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/service_domains',
  findAll()
  {
    return axios.get(
      "/service_domains?orderBy[name]=asc&pagination=false"
    );
  },
}

let merged = merge(api_base, thisApi)

export default merged
