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

interface State
{
  error: any
  isAuthenticated: boolean
  isLoading: boolean
  JWTToken: string | null
  JWTTokenInfo: any
  currentUserRoles: string[]
  lastPoints: number
  me: Utilisateur | null
  points: number
  roles: string[]
  roleHierarchy: any
  roleHierarchyMap: any
  switch_user: any
}

interface LoginPayload
{
  login: string
  password: string
}

interface JWTTokenInfo
{
  id?: number
  created?: string

  exp?: number;
  human_exp?: string;
  human_iat?: string;
  logged_at?: string;
  iat?: string;
  ip?: string;
  roles?: string[];
  firstname?: string;
  lastname?: string;
  username?: string;
  authToken?: string;
  points?: number;
  lastPoints?: number;
}

export const useSecurityStore = defineStore('security', {
  state: (): State => ({
    error: null,
    isAuthenticated: false,
    isLoading: false,
    JWTToken: null,
    JWTTokenInfo: null,
    currentUserRoles: [],
    lastPoints: 0,
    me: null,
    points: 0,
    roles: [],
    roleHierarchy: {},
    roleHierarchyMap: {},
    switch_user: null,
  }),
  getters: {
    getJWTToken(state)
    {
      if (state.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
        state.JWTToken = sessionStorage.getItem("JWTToken")
      }
      return state.JWTToken
    },
    getAuthToken(state)
    {
      //authToken for legacy intranet
      if (state.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.authToken : null
    },
    getEmail(state)
    {
      if (
        state.JWTTokenInfo == null &&
        sessionStorage.getItem("JWTToken") != null
      ) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.email : null
    },
    getId(state)
    {
      if (
        state.JWTTokenInfo == null &&
        sessionStorage.getItem("JWTToken") != null
      ) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      //user impersonated
      if (state.switch_user && "id" in state.switch_user) {
        return state.switch_user.id
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.id : null
    },
    getFirstname(state)
    {
      if (
        state.JWTTokenInfo == null &&
        sessionStorage.getItem("JWTToken") != null
      ) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.firstname : null
    },
    getLastname(state)
    {
      if (
        state.JWTTokenInfo == null &&
        sessionStorage.getItem("JWTToken") != null
      ) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.lastname : null
    },
    getLoggedAs(state)
    {
      if (state.switch_user) {
        return state.switch_user.identifiant;
      }
      return;
    },
    getUsername(state)
    {
      if (
        state.JWTTokenInfo == null &&
        sessionStorage.getItem("JWTToken") != null
      ) {
        state.JWTTokenInfo = parseJwt(sessionStorage.getItem("JWTToken"))
      }
      return state.JWTTokenInfo != null ? state.JWTTokenInfo.username : null
    },
    getJWTTokenInfo(state)
    {
      return parseJwt(state.JWTToken)
    },
    isLoggedAs(state)
    {
      return state.switch_user != null
    },
    getIsAuthenticated(state)
    {
      if (state.JWTToken == null && sessionStorage.getItem("JWTToken") != null) {
        state.JWTToken = sessionStorage.getItem("JWTToken")
      }
      return state.JWTToken != null
    },
    hasError(state)
    {
      return state.error !== null
    },
    hasRole(state)
    {
      return function (role: string)
      {
        return searchRoleInList(role, state.currentUserRoles, state.roleHierarchyMap)
      }
    },
    isAdmin(state)
    {
      let JWTTokenInfo = parseJwt(state.JWTToken)
      return (
        JWTTokenInfo != null &&
        JWTTokenInfo.roles &&
        JWTTokenInfo.roles.indexOf("ROLE_ADMIN") >= 0
      )
    },
  },
  actions: {
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

        this.isAuthenticated = true;
        this.JWTToken = response.data.token;
        this.JWTTokenInfo = parseJwt(this.JWTToken);
        this.currentUserRoles = this.JWTTokenInfo.roles;
        sessionStorage.setItem("JWTToken", this.JWTToken);
        sessionStorage.setItem("JWTTokenInfo", JSON.stringify(this.JWTTokenInfo));

        for (let i in this.JWTTokenInfo) {
          sessionStorage.setItem(
            i,
            this.JWTTokenInfo != null ? this.JWTTokenInfo[i] : null
          );
        }

        token = response.data.token
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
      if(this.JWTToken != null){
        this.JWTTokenInfo = parseJwt(this.JWTToken);
        this.currentUserRoles = this.JWTTokenInfo.roles;
        sessionStorage.setItem("JWTTokenInfo", JSON.stringify(this.JWTTokenInfo));
      }
    },
    destroySessionStorage(){
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
    // switchUser(, user)
    // {
    //   commit(SWITCH_USER, user)
    // },
    switchUserReset()
    {
      this.switch_user = null;
      this.currentUserRoles = this.JWTTokenInfo.roles;
    },
  },
})
