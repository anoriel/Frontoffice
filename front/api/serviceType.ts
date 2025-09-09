import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/service_types',
  findAll()
  {
    return axios.get(
      "/service_types?orderBy[name]=asc&pagination=false"
    );
  },
}

let merged = merge(api_base, thisApi)

export default merged
