import api_base from "./api_base";
import merge from 'deepmerge-json';

let extendedValues = {
  baseUrl()
  {
    return "/api/crm_list_settings";
  },
  findItemsByType(type)
  {
    return this.axios().get(`${this.baseUrl()}?type=${type}`);
  },
};

let merged = merge(api_base, extendedValues);

export default merged;