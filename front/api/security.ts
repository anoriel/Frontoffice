import { Utilisateur } from "@/interfaces/utilisateur";
import axios from "@/plugins/axios/axios";


interface TokenResponse
{
  token: string
}

async function getApiMe()
{
  return await axios.get<Utilisateur>("/me");
}
async function getLongRequest()
{
  return await axios.get("/getLongRequest/1");
}



async function login(login: string, password: string)
{
  return axios.post<TokenResponse>("/login", {
    identifiant: login,
    mot_de_passe: password,
  });
}

async function logout()
{
  return axios.get("/logout");
}
async function loadRoleHierarchy()
{
  return axios.get("/role_hierarchy");
}

async function loadRoleHierarchyMap()
{
  return axios.get("/role_hierarchy_map");
}

export default {
  getApiMe,
  getLongRequest,
  login,
  logout,
  loadRoleHierarchy,
  loadRoleHierarchyMap,
}
