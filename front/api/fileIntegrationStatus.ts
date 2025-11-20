import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/file_integration_statuses',
  findAll()
  {
    return axios.get(`${this.baseUrl}?pagination=false`);
  },
}

let merged = merge(api_base, thisApi)

export default merged
