import axios from "@/plugins/axios/axios";
import api_base from './api_base';
import merge from 'deepmerge-json';


const thisApi = {
  baseUrl: "/utilisateurs",
  findItemsByType(type: string)
  {
    return axios.get(`${this.baseUrl}?type=${type}`);
  },
  findAll()
  {
    return this.findBy();
  },
  findAllActive()
  {
    return this.findBy(true);
  },
  findBy(active: boolean = false, role: string | null = null)
  {
    let url = `${this.baseUrl}?orderBy[nom]=asc&orderBy[prenom]=asc&pagination=false`;
    if (role && role.length) {
      url += `&rolesJson=${role}`
    }
    if (active) {
      url += `&actif=true`
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
