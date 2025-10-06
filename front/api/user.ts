import axios from "@/plugins/axios/axios";
import api_base from './api_base';
import merge from 'deepmerge-json';


const thisApi = {
  baseUrl: "/utilisateurs",
  findItemsByType(type: string)
  {
    return axios.get(`${this.baseUrl}?type=${type}`);
  },
  findAll(showFullData: boolean = false)
  {
    return this.findBy(false, null, showFullData);
  },
  findAllActive(showFullData: boolean = false)
  {
    return this.findBy(true, null, showFullData);
  },
  findBy(active: boolean = false, role: string | null = null, showFullData: boolean = false)
  {
    let url = `${this.baseUrl}?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false`;
    if (role && role.length) {
      url += `&rolesJson=${role}`
    }
    if (active) {
      url += `&actif=true`
    }
    if (showFullData) {
      url += `&showFullData=true`
    }
    return axios.get(url);
  },
  async getCurrentlyLoggedUsers()
  {
    return axios.get("/getCurrentlyLoggedUsers");
  },
  async getNumberOfCurrentlyLoggedUsers()
  {
    return axios.get("/getCurrentlyLoggedUsers?countOnly=1");
  }
}

let merged = merge(api_base, thisApi);

export default merged;
