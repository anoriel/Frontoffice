import { defineStore } from 'pinia'
import SecurityAPI from '@/api/security'
import { Utilisateur } from '@/interfaces/utilisateur'

function parseJwt(JWTToken: string | null): JWTTokenInfo | null
{
  if (!JWTToken) return null

  let base64Url = JWTToken.split(".")[1]
  if (base64Url) {
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c)
        {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join("")
    )

    let jsonParsed = JSON.parse(jsonPayload)

    let me = jsonParsed?.me as string | null;
    if (me != null && jsonParsed != null) {
      let meObj = JSON.parse(me);
      jsonParsed.email = meObj.email;
    }

    return JSON.parse(jsonPayload)
  }
  return null
}

interface RolesArray
{
  'name': string
  'children': RolesArray[]
  'selected': boolean,
}

function parseRoleHierarchy(list: any, mainRole: string): RolesArray
{
  let rolesArray: RolesArray = {
    'name': mainRole,
    'children': [],
    'selected': false,
  }

  if (mainRole in list) {
    for (let i in list[mainRole]) {
      let subRole = list[mainRole][i]
      rolesArray.children.push(parseRoleHierarchy(list, subRole))
    }
  }

  return rolesArray
}

function searchRoleInList(role: string, list: any, roleHierarchyMap: any)
{
  if (!list) {
    return false
  }
  if (list.indexOf(role) >= 0 || !role.length) {
    return true
  }

  for (let i in list) {
    let newList = list[i]
    if (newList in roleHierarchyMap && searchRoleInList(role, roleHierarchyMap[newList], roleHierarchyMap)) {
      return true
    }
  }

  return false
}

interface LoginPayload
{
  login: string
  password: string
}

interface JWTTokenInfo
{
  id: number
  created: string

  exp: number;
  human_exp: string;
  human_iat: string;
  logged_at: string;
  iat: string;
  ip: string;
  roles: string[];
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  authToken?: string;
  points?: number;
  lastPoints?: number;
  [key: string]: string | number | string[] | undefined;
}

let extendedValues = {
  error: null as any,
  isAuthenticated: false,
  isLoading: false,
  JWTToken: null as string | null,
  JWTTokenInfo: null as JWTTokenInfo | null,
  currentUserRoles: [] as string[] | null,
  lastPoints: 0,
  me: null as Utilisateur | null,
  points: 0,
  roles: [] as string[],
  roleHierarchy: {},
  roleHierarchyMap: {},
  switch_user: null as Utilisateur | null,

  getJWTToken()
  {
    if (this.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
      this.JWTToken = sessionStorage.getItem("JWTToken")
    }
    return this.JWTToken
  },
  getAuthToken()
  {
    //authToken for legacy intranet
    if (this.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.authToken : null
  },
  getId()
  {
    if (
      this.JWTTokenInfo == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    //user impersonated
    if (this.switch_user && "id" in this.switch_user) {
      return this.switch_user.id
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.id : null
  },
  getEmail()
  {
    if (
      this.JWTTokenInfo == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"));
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.email : null;
  },
  getFirstname()
  {
    if (
      this.JWTTokenInfo == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.firstname : null
  },
  getLastname()
  {
    if (
      this.JWTTokenInfo == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.lastname : null
  },
  getLoggedAs()
  {
    if (this.switch_user) {
      return this.switch_user.identifiant;
    }
    return;
  },
  getUsername()
  {
    if (
      this.JWTTokenInfo == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      this.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return this.JWTTokenInfo != null ? this.JWTTokenInfo.username : null
  },
  getJWTTokenInfo()
  {
    return parseJwt(this.JWTToken)
  },
  isLoggedAs()
  {
    return this.switch_user != null
  },
  getIsAuthenticated()
  {
    if (this.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
      this.JWTToken = sessionStorage.getItem("JWTToken")
    }
    return this.JWTToken != null
  },
  hasError()
  {
    return this.error !== null
  },
  hasRole(role: string)
  {
    return searchRoleInList(role, this.currentUserRoles, this.roleHierarchyMap)
  },
  isAdmin()
  {
    let JWTTokenInfo = parseJwt(this.JWTToken)
    return (
      JWTTokenInfo != null &&
      JWTTokenInfo.roles &&
      JWTTokenInfo.roles.indexOf("ROLE_ADMIN") >= 0
    )
  },

  async getApiMe()
  {
    this.error = null
    this.isLoading = true
    try {
      let response = await SecurityAPI.getApiMe()
      this.me = response.data
      if (this.me.impersonateUser != null) {
        delete (this.me.impersonateUser.impersonateUser)
        this.switch_user = this.me.impersonateUser
        if (this.me.impersonateUser) {
          this.currentUserRoles = this.me.impersonateUser.roles
        }
      } else {
        this.switch_user = null
        if (this.me.roles) {
          this.currentUserRoles = this.me.roles
        }
      }
      if (this.me.lastPoints) {
        this.lastPoints = this.me.lastPoints
      }
    } catch (error) {
      console.log(typeof this.error)
      // this.error = error
    }
    this.isLoading = false
  },
  async getLongRequest()
  {
    this.error = null
    this.isLoading = true
    try {
      await SecurityAPI.getLongRequest()
      this.isLoading = false
    } catch (error) {
      this.error = error
      this.isLoading = false
    }
  },
  async login(payload: LoginPayload)
  {
    this.error = null
    this.isAuthenticated = false;
    this.isLoading = true
    this.JWTToken = null;
    this.JWTTokenInfo = null;
    this.currentUserRoles = [];
    let token = null
    try {
      let response = await SecurityAPI.login(payload.login, payload.password)

      this.JWTToken = response.data.token;
      this.JWTTokenInfo = parseJwt(this.JWTToken);
      if (this.JWTTokenInfo != null) {
        this.currentUserRoles = this.JWTTokenInfo.roles;
      }
      sessionStorage.setItem("JWTToken", this.JWTToken);
      sessionStorage.setItem("JWTTokenInfo", JSON.stringify(this.JWTTokenInfo));

      for (let i in this.JWTTokenInfo) {
        const value = this.JWTTokenInfo != null ? this.JWTTokenInfo[i] : null;
        sessionStorage.setItem(
          i,
          value !== null ? String(value) : ''
        );
      }

      token = response.data.token
      await this.loadRoleHierarchy();
      await this.loadRoleHierarchyMap();
      this.isAuthenticated = true;
    } catch (error) {
      this.error = error
    }
    this.isLoading = false
    return token
  },
  onRefresh()
  {
    this.disconnect()
    this.JWTToken = sessionStorage.getItem("JWTToken");
    this.isAuthenticated = this.JWTToken != null;
    if (this.JWTToken != null) {
      this.JWTTokenInfo = parseJwt(this.JWTToken);
      this.currentUserRoles = this.JWTTokenInfo ? this.JWTTokenInfo.roles : [];
      sessionStorage.setItem("JWTTokenInfo", JSON.stringify(this.JWTTokenInfo));
    }
  },
  destroySessionStorage()
  {
    sessionStorage.removeItem("JWTToken");
    sessionStorage.removeItem("JWTTokenInfo");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("human_iat");
    sessionStorage.removeItem("human_exp");
    sessionStorage.removeItem("points");
    sessionStorage.removeItem("lastPoints");
  },
  disconnect()
  {
    this.isAuthenticated = false;
    this.JWTToken = null;
    this.JWTTokenInfo = null;
    this.currentUserRoles = [];
    this.roles = [];
    this.roleHierarchy = {};
    this.roleHierarchyMap = {};
  },
  async logout()
  {
    this.error = null
    this.isLoading = true
    try {
      await SecurityAPI.logout()
      this.disconnect()
      this.destroySessionStorage()
    } catch (error) {
      this.error = error
    }
    this.isLoading = false
  },
  async loadRoleHierarchy()
  {
    this.error = null
    this.isLoading = true
    this.roles = []
    this.roleHierarchy = {}
    try {
      let response = await SecurityAPI.loadRoleHierarchy()

      this.roles = Object.keys(response.data)
      this.roleHierarchy = parseRoleHierarchy(response.data, 'ROLE_SUPER_ADMIN')
    } catch (error) {
      this.error = error
    }
    this.isLoading = false
  },
  async loadRoleHierarchyMap()
  {
    this.error = null
    this.isLoading = true
    this.roleHierarchyMap = {}
    try {
      let response = await SecurityAPI.loadRoleHierarchyMap()

      this.roleHierarchyMap = response.data
    } catch (error) {
      this.error = error
    }
    this.isLoading = false
  },
  switchUser(user: Utilisateur)
  {
    this.switch_user = user;
    this.currentUserRoles = user ? user.roles : [];
  },
  switchUserReset()
  {
    this.switch_user = null;
    this.currentUserRoles = this.JWTTokenInfo ? this.JWTTokenInfo.roles : [];
  },
}

export const useSecurityStore = defineStore('security', () => extendedValues)
