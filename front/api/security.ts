import { Utilisateur } from "@/interfaces/utilisateur";
import axios from "@/plugins/axios/axios";
import api_base from './api_base'
import merge from 'deepmerge-json'

interface TokenResponse
{
  token: string
}

const thisApi = {
  async getApiMe()
  {
    return await axios.get<Utilisateur>("/me");
  },
  async getLongRequest()
  {
    return await axios.get("/getLongRequest/1");
  },
  async login(login: string, password: string)
  {
    return axios.post<TokenResponse>("/login", {
      identifiant: login,
      mot_de_passe: password,
    });
  },

  async logout()
  {
    return axios.get("/logout");
  },
  async loadRoleHierarchy()
  {
    return axios.get("/role_hierarchy");
  },

  async loadRoleHierarchyMap()
  {
    return axios.get("/role_hierarchy_map");
  },
}

let merged = merge(api_base, thisApi)

export default merged

