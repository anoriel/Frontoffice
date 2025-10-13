import { defineStore } from 'pinia'
import thisAPI from '@/api/security'
import { useBaseStore } from './baseStore';
import { Utilisateur } from '@/interfaces/utilisateur'
import { ref, watch } from 'vue';


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



export const useSecurityStore = defineStore('security', () =>
{
  const {
    api,
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,
  } = useBaseStore();

  api.value = thisAPI


  const isAuthenticated = ref(false)
  const JWTToken = ref(null as string | null)
  const JWTTokenInfo = ref(null as JWTTokenInfo | null)
  const currentUserRoles = ref([] as string[] | null)
  const lastPoints = ref(0)
  const lastUrl = ref<string | null>(localStorage.getItem("lastUrl"))
  const me = ref(null as Utilisateur | null)
  const points = ref(0)
  const returnUrl = ref<string | null>(null)
  const roles = ref([] as string[])
  const roleHierarchy = ref({})
  const roleHierarchyMap = ref({})
  const switch_user = ref(null as Utilisateur | null)

  // Watch for changes to lastUrl
  watch(lastUrl, () =>
  {
    if (lastUrl.value) {
      localStorage.setItem("lastUrl", lastUrl.value);
    } else {
      localStorage.removeItem("lastUrl");
    }
  });

  function getJWTToken()
  {
    if (JWTToken.value == null && sessionStorage.getItem("JWTToken") != null) {
      JWTToken.value = sessionStorage.getItem("JWTToken")
    }
    return JWTToken.value
  }

  function getAuthToken()
  {
    //authToken for legacy intranet
    if (JWTToken.value == null && sessionStorage.getItem("JWTToken") != null) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.authToken : null
  }

  function getId()
  {
    if (
      JWTTokenInfo.value == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    //user impersonated
    if (switch_user.value && "id" in switch_user.value) {
      return switch_user.value.id
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.id : null
  }

  function getEmail()
  {
    if (
      JWTTokenInfo.value == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"));
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.email : null;
  }

  function getFirstname()
  {
    if (
      JWTTokenInfo.value == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.firstname : null
  }

  function getLastname()
  {
    if (
      JWTTokenInfo.value == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.lastname : null
  }

  function getLoggedAs()
  {
    if (switch_user.value) {
      return switch_user.value.identifiant;
    }
    return;
  }

  function getUsername()
  {
    if (
      JWTTokenInfo.value == null &&
      sessionStorage.getItem("JWTToken") != null
    ) {
      JWTTokenInfo.value = parseJwt(sessionStorage.getItem("JWTToken"))
    }
    return JWTTokenInfo.value != null ? JWTTokenInfo.value.username : null
  }

  function getJWTTokenInfo()
  {
    return parseJwt(JWTToken.value)
  }

  function isLoggedAs()
  {
    return switch_user.value != null
  }

  function getIsAuthenticated()
  {
    if (JWTToken.value == null && sessionStorage.getItem("JWTToken") != null) {
      JWTToken.value = sessionStorage.getItem("JWTToken")
    }
    return JWTToken.value != null
  }

  function hasRole(role: string)
  {
    return searchRoleInList(role, currentUserRoles.value, roleHierarchyMap.value)
  }

  function isAdmin()
  {
    let JWTTokenInfo = parseJwt(JWTToken.value)
    return (
      JWTTokenInfo != null &&
      JWTTokenInfo.roles &&
      JWTTokenInfo.roles.indexOf("ROLE_ADMIN") >= 0
    )
  }

  async function getApiMe()
  {
    error.value = null
    isLoading.value = true
    try {
      let response = await thisAPI.getApiMe()
      me.value = response.data
      if (me.value?.impersonateUser != null) {
        delete (me.value.impersonateUser.impersonateUser)
        switch_user.value = me.value.impersonateUser
        if (me.value.impersonateUser) {
          currentUserRoles.value = me.value.impersonateUser.roles
        }
      } else {
        switch_user.value = null
        if (me.value?.roles) {
          currentUserRoles.value = me.value.roles
        }
      }
      if (me.value?.lastPoints) {
        lastPoints.value = me.value.lastPoints
      }
    } catch (error) {
      console.log(typeof error)
      // error = error
    }
    isLoading.value = false
  }

  async function getLongRequest()
  {
    error.value = null
    isLoading.value = true
    try {
      await thisAPI.getLongRequest()
      isLoading.value = false
    } catch (error) {
      error = error
      isLoading.value = false
    }
  }

  async function login(payload: LoginPayload)
  {
    error.value = null
    isAuthenticated.value = false;
    isLoading.value = true
    JWTToken.value = null;
    JWTTokenInfo.value = null;
    currentUserRoles.value = [];
    let token = null
    try {
      let response = await thisAPI.login(payload.login, payload.password)

      JWTToken.value = response.data.token;
      JWTTokenInfo.value = parseJwt(JWTToken.value);
      if (JWTTokenInfo.value != null) {
        currentUserRoles.value = JWTTokenInfo.value.roles;
      }
      if (JWTToken.value) {
        sessionStorage.setItem("JWTToken", JWTToken.value);
      }
      sessionStorage.setItem("JWTTokenInfo", JSON.stringify(JWTTokenInfo.value));

      for (let i in JWTTokenInfo.value) {
        const value = JWTTokenInfo.value != null ? JWTTokenInfo.value[i] : null;
        sessionStorage.setItem(
          i,
          value !== null ? String(value) : ''
        );
      }

      token = response.data.token
      await loadRoleHierarchy();
      await loadRoleHierarchyMap();
      isAuthenticated.value = true;
    } catch (error) {
      error = error
    }
    isLoading.value = false
    return token
  }

  function onRefresh()
  {
    disconnect()
    JWTToken.value = sessionStorage.getItem("JWTToken");
    isAuthenticated.value = JWTToken.value != null;
    if (JWTToken.value != null) {
      JWTTokenInfo.value = parseJwt(JWTToken.value);
      currentUserRoles.value = JWTTokenInfo.value ? JWTTokenInfo.value.roles : [];
      sessionStorage.setItem("JWTTokenInfo", JSON.stringify(JWTTokenInfo.value));
    }
  }

  function destroySessionStorage()
  {
    sessionStorage.removeItem("JWTToken");
    sessionStorage.removeItem("JWTTokenInfo");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("human_iat");
    sessionStorage.removeItem("human_exp");
    sessionStorage.removeItem("points");
    sessionStorage.removeItem("lastPoints");
  }

  function disconnect()
  {
    isAuthenticated.value = false;
    JWTToken.value = null;
    JWTTokenInfo.value = null;
    currentUserRoles.value = [];
    roles.value = [];
  }

  async function logout()
  {
    error.value = null
    isLoading.value = true
    try {
      await thisAPI.logout()
      disconnect()
      destroySessionStorage()
    } catch (error) {
      error = error
    }
    isLoading.value = false
  }
  async function loadRoleHierarchy()
  {
    error.value = null
    isLoading.value = true
    roles.value = []
    roleHierarchy.value = {}
    try {
      let response = await thisAPI.loadRoleHierarchy()

      roles.value = Object.keys(response.data)
      roleHierarchy.value = parseRoleHierarchy(response.data, 'ROLE_SUPER_ADMIN')
    } catch (error) {
      error = error
    }
    isLoading.value = false
  }
  async function loadRoleHierarchyMap()
  {
    error.value = null
    isLoading.value = true
    roleHierarchyMap.value = {}
    try {
      let response = await thisAPI.loadRoleHierarchyMap()

      roleHierarchyMap.value = response.data
    } catch (error) {
      error = error
    }
    isLoading.value = false
  }

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

      let meFromJson = jsonParsed?.me as string | null;
      if (meFromJson != null && jsonParsed != null) {
        let meObj = JSON.parse(meFromJson);
        jsonParsed.email = meObj.email;
        me.value = meObj
      }

      return jsonParsed
    }
    return null
  }

  function switchUser(user: Utilisateur)
  {
    switch_user.value = user;
    currentUserRoles.value = user ? user.roles : [];
  }

  function switchUserReset()
  {
    switch_user.value = null;
    currentUserRoles.value = JWTTokenInfo.value ? JWTTokenInfo.value.roles : [];
  }


  return {
    currentPage,
    isLoading,
    error,
    item,
    list,
    totalItems,
    deleteItem,
    findAll,
    find,
    hasError,
    hasItems,
    getById,
    reset,
    save,
    resetError,

    isAuthenticated,
    JWTToken,
    JWTTokenInfo,
    currentUserRoles,
    lastPoints,
    lastUrl,
    me,
    points,
    returnUrl,
    roles,
    roleHierarchy,
    roleHierarchyMap,
    switch_user,

    getJWTToken,
    getAuthToken,
    getId,
    getEmail,
    getFirstname,
    getLastname,
    getLoggedAs,
    getUsername,
    getJWTTokenInfo,
    isLoggedAs,
    getIsAuthenticated,
    hasRole,
    isAdmin,
    getApiMe,
    getLongRequest,
    loadRoleHierarchy,
    loadRoleHierarchyMap,
    login,
    logout,
    onRefresh,
    switchUser,
    switchUserReset,
  }
})

