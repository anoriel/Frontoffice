import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/pays',
  findAll()
  {
    return axios.get(
      "/lead_types?pagination=false"
    );
  },
}

let merged = merge(api_base, thisApi)

export default merged
