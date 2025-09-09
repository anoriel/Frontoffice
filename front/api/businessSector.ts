import api_base from './api_base'
import merge from 'deepmerge-json'

const thisApi = {
  baseUrl: '/business_sectors',
}

let merged = merge(api_base, thisApi)

export default merged
