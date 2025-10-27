import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/media_object',
  getMediaObject(url: string)
  {
    return axios.get(url, { responseType: 'blob' });
  },
}

let merged = merge(api_base, thisApi)

export default merged
