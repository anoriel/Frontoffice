<template>
  <v-app>
    <v-app-bar color="blue-darken-4" image="/images/bg-header.png">
      <v-app-bar-title>
        <img src="/images/asd-group-logo-couleur-transparent-white.png" :alt="appTitle" :title="appTitle" height="48" />
        <span>{{ appTitle }}</span>

        <v-btn variant="elevated" color="primary" :href="getLegacyIntranetUrl()" class="ml-16">
          <v-icon>mdi-link-variant</v-icon>
          &nbsp; Go to
          {{ $helpers.capitalizeFirstLetter($t('legacy intranet')) }} !
          <v-icon>mdi-arrow-right-bold-circle</v-icon>
        </v-btn>
      </v-app-bar-title>

      <v-btn v-if="globalStore.isBackgroundLoading" size="x-small">
        <v-progress-circular color="white" indeterminate :size="20" :width="2"></v-progress-circular>&nbsp;{{
          $t('loading') }}...
      </v-btn>

      <v-btn v-if="securityStore.isAdmin() && !securityStore.isLoggedAs()" @click="showLoggedUsers()">
        {{ numberOfCurrentlyLoggedUsers }}
        {{ $t('# users currently connected', numberOfCurrentlyLoggedUsers) }}
      </v-btn>

      <v-btn v-if="securityStore.isLoggedAs()" @click="securityStore.switchUserReset()" color="warning"
        variant="elevated" append-icon="mdi-logout">
        {{ $helpers.capitalizeFirstLetter($t('log as'))
        }}{{ $helpers.capitalizeFirstLetter($t(':')) }}{{ securityStore.getLoggedAs() }}
        <template v-slot:append>
          <v-icon color="white"></v-icon>
        </template>
      </v-btn>

      <v-menu transition="scale-transition" v-if="securityStore.getIsAuthenticated() && !securityStore.isLoggedAs()">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="white" variant="elevated" append-icon="mdi-dots-vertical">
            <template v-slot:prepend>
              <vue-gravatar :email="securityStore.getEmail()" :size="24" :default-image="$gravatarDefaultImage"
                class="gravatar" />
            </template>
            {{ securityStore.getFirstname() }} {{ securityStore.getLastname() }}

            <template v-slot:append>
              <v-icon color="primary"></v-icon>
            </template>
          </v-btn>
        </template>

        <v-list>
          <v-list-item append-icon="mdi-logout" link>
            <v-list-item-title @click="logout()">{{
              $helpers.capitalizeFirstLetter($t('logout'))
            }}</v-list-item-title>
            <template v-slot:append>
              <v-icon color="primary"></v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <nav-bar />
    <page-title />
    <v-container>
      <router-view />
    </v-container>
    <div class="copyright">
      &copy; 2007-{{ getCopyrightEndDate() }} ASD international - {{ releaseVersion }}{{ getEnvironment() }}
    </div>
  </v-app>
</template>

<style>
.gravatar {
  vertical-align: bottom;
}

.v-toolbar-title__placeholder {
  align-items: center !important;
  display: flex !important;
}
</style>

<style scoped>
.copyright {
  background-image: url(/images/bg-footer.png);
  background-size: 100% 100%;
  bottom: 0;
  color: #e5ebf0;
  font-size: 10px;
  height: 26px;
  left: 0;
  line-height: 26px;
  position: fixed;
  right: 0;
  text-align: center;
  z-index: 9999;
}


.v-toolbar-title__placeholder>span {
  align-items: center !important;
  display: flex !important;
  gap: 1rem;
  padding-left: 1rem !important;
  padding-top: 12px !important;
}
</style>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import NavBar from './components/NavBar.vue'
import UserCircle from './components/UserCircle.vue'
import axios from './plugins/axios/axios'
import { useSecurityStore } from './stores/security'
const securityStore = useSecurityStore()
import { useGlobalStore } from './stores/global'
const globalStore = useGlobalStore()
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appTitle = import.meta.env.VITE_APP_TITLE
const legacyIntranetUrl = import.meta.env.VITE_INTRANET_LEGACY_URL
const releaseVersion = import.meta.env.VITE_RELEASE_VERSION
const environment = import.meta.env.VITE_ENV

const router = useRouter()
const route = useRoute()


let axiosIsLoading = ref(false)
let axiosNbRequests = ref(0)
let axiosMaxRequests = ref(0)


securityStore.onRefresh()

function checkIsLogged()
{
  if (router.currentRoute.value.name != "login" && !securityStore.getIsAuthenticated())
  {
    router.push({ name: 'login' });
    return false;
  }
  return true;
}

router.beforeEach(async (to, from) =>
{
  if (!securityStore.getIsAuthenticated() && to.name !== 'login'
  )
  {
    return { name: 'login' }
  }
})
router.afterEach((to, from) =>
{
  document.title = appTitle + (to?.meta?.title ? (' - ' + to?.meta?.title) : '');
});


axios.interceptors.request.use((request) =>
{
  axiosIsLoading = true
  axiosNbRequests++
  axiosMaxRequests++

  if (securityStore.switch_user && request.url.length)
  {
    if (request.url.includes('?'))
    {
      request.url += '&'
    } else
    {
      request.url += '?'
    }
    request.url += '_switch_user=' + this.getLoggedAs()
  }
  if (sessionStorage.getItem('JWTToken'))
  {
    request.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('JWTToken')
  }
  if (request.method == 'patch')
  {
    request.headers['Content-Type'] = 'application/merge-patch+json'
  } else if (request.method == 'post')
  {
    request.headers['Content-Type'] = 'application/json'
  }
  return request
})

axios.interceptors.response.use(
  (response) =>
  {
    interceptResponse(response)
    return response
  },
  (err) =>
  {
    interceptResponse(err)
    if (err.response.status === 401)
    {
      logout()
    } else if (err.response.status === 500 || err.response.status === 400)
    {
      console.log('Erreur lors de la mise à jour', err.response.data.error)
    } else if (err.response.status === 403)
    {
      err.response.data['description'] = 'accessDenied'
    }
    return new Promise(() =>
    {
      throw err.response
    })
  },
)

function getCopyrightEndDate()
{
  return new Date().getFullYear();
}

function getEnvironment()
{
  if (environment != 'prod')
  {
    return " - " + environment;
  }
  return "";
}

function getLegacyIntranetUrl()
{
  let username = sessionStorage.getItem('username')
  let authToken = sessionStorage.getItem('authToken')
  if (null == username || null == authToken)
  {
    return legacyIntranetUrl
  }
  return (
    legacyIntranetUrl +
    '/admin/identification.php?identifiant=' +
    username +
    '&authToken=' +
    authToken
  )
}

function interceptResponse(response)
{
  axiosIsLoading = true
  axiosNbRequests--

  if (axiosNbRequests <= 0)
  {
    axiosNbRequests = 0
    axiosMaxRequests = 0
    axiosIsLoading = false
  }
}

async function logout()
{
  await securityStore.logout()

  checkIsLogged()
}

//load mandatory data

if (checkIsLogged())
{
  if (!Object.keys(securityStore.roleHierarchy).length)
  {
    securityStore.loadRoleHierarchy();
  }

  if (!Object.keys(securityStore.roleHierarchyMap).length)
  {
    securityStore.loadRoleHierarchyMap()
  }
}
// securityStore.getApiMe()
</script>
