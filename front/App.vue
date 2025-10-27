<template>
  <v-app>
    <v-app-bar color="blue-darken-4" image="/images/bg-header.png" density="compact">
      <v-app-bar-title>
        <router-link :to="{ name: 'welcome' }" id="logo" style="cursor: pointer;">
          <img src="/images/asd-group-logo-couleur-transparent-white.png" :alt="appTitle" :title="appTitle"
            height="48" />
          {{ appTitle }}
        </router-link>

        <v-btn color="primary" :href="$helpers.getLegacyIntranetUrl()" class="ml-16" variant="elevated" elevation="5"
          rounded="0">
          <v-icon>mdi-link-variant</v-icon>
          &nbsp; Go to
          {{ $helpers.capitalizeFirstLetter($t('legacy intranet')) }} !
          <v-icon>mdi-arrow-right-bold-circle</v-icon>
        </v-btn>
      </v-app-bar-title>

      <v-btn v-if="axiosIsLoading" size="x-small" variant="text" rounded="0">
        <v-progress-circular color="white" indeterminate :size="20" :width="2"></v-progress-circular>&nbsp;{{
          $t('loading') }}...
      </v-btn>

      <v-btn v-if="securityStore.isAdmin() && !securityStore.isLoggedAs()" @click="showLoggedUsers()" variant="flat"
        rounded="0">
        {{ numberOfCurrentlyLoggedUsers }}
        {{ $t('# users currently connected', numberOfCurrentlyLoggedUsers) }}
      </v-btn>

      <v-btn v-if="securityStore.isLoggedAs()" @click="securityStore.switchUserReset()" color="warning" variant="flat"
        rounded="0" append-icon="mdi-logout">
        {{ $helpers.capitalizeFirstLetter($t('log as'))
        }}{{ $helpers.capitalizeFirstLetter($t(':')) }}{{ securityStore.getLoggedAs() }}
        <template v-slot:append>
          <v-icon color="white"></v-icon>
        </template>
      </v-btn>

      <v-menu transition="scale-transition" v-if="securityStore.getIsAuthenticated() && !securityStore.isLoggedAs()">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="white" append-icon="mdi-dots-vertical" variant="flat" rounded="0">
            <img :src="$helpers.getGravatarURL(securityStore.getEmail(), 24, $gravatarDefaultImage)"
              style="vertical-align: bottom;" class="rounded-circle me-1" />
            {{ securityStore.getFirstname() }} {{ securityStore.getLastname() }}

            <template v-slot:append>
              <v-icon color="primary"></v-icon>
            </template>
          </v-btn>
        </template>

        <v-list>
          <v-list-item append-icon="mdi-logout" link @click="logout()">
            <v-list-item-title>{{
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
    <v-main style="height: 100vh;">
      <router-view />
    </v-main>
    <div class="copyright">
      &copy; 2007-{{ getCopyrightEndDate() }} ASD international - {{ releaseVersion }}{{ getEnvironment() }}
    </div>
  </v-app>

  <v-dialog v-model="globalStore.isLoadingWithLock" max-width="320" persistent>
    <v-list class="py-2 bg-blue-darken-4" elevation="12" rounded="lg">
      <v-list-item :title="$helpers.capitalizeFirstLetter($t('loading'))">
        <template v-slot:prepend>
          <div class="pe-4">
            <img src="/images/asd-group-logo-couleur-transparent-white.png" alt="ASD GROUP" title="ASD GROUP"
              height="48" />
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
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


#logo {
  align-items: center !important;
  color: white;
  display: flex !important;
  gap: 1rem;
  padding-left: 1rem !important;
  padding-top: 0 !important;
  text-decoration: none !important;
}
</style>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import NavBar from './components/NavBar.vue'
import axios from './plugins/axios/axios'
import { useSecurityStore } from './stores/security'
const securityStore = useSecurityStore()
import { useGlobalStore } from './stores/global'
const globalStore = useGlobalStore()
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import useCommonHelper from '@/helpers/commonHelper'
const helpers = useCommonHelper()
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });


const appTitle = import.meta.env.VITE_APP_TITLE
const releaseVersion = import.meta.env.VITE_RELEASE_VERSION
const environment = import.meta.env.VITE_ENV



let axiosIsLoading = ref(false)
let axiosNbRequests = ref(0)
let axiosMaxRequests = ref(0)


securityStore.onRefresh()


router.beforeEach(async (to, from) =>
{
  if (!securityStore.getIsAuthenticated() && to.name !== 'login'
  )
  {
    securityStore.returnUrl = to.fullPath;
    return { name: 'login' }
  }
})

//routes that do not require loading with lock
const routeNamesWithoutLock = ['login', 'error-403', 'error-404', 'error-500', 'home', 'welcome'];

router.afterEach((to, from) =>
{
  //set page title
  document.title = appTitle + (to?.meta?.title ? (' - ' + helpers.capitalizeFirstLetter(t(to.meta.title))) : '');

  //set loading with lock only if the route is not in the list of routes without lock
  if (routeNamesWithoutLock.includes(to.name))
  {
    globalStore.isLoadingWithLock = false
  } else
  {
    globalStore.isLoadingWithLock = true
  }

  //save last url if not on login page and authenticated
  if (to.name !== 'login' && securityStore.getIsAuthenticated())
  {
    securityStore.lastUrl = to.fullPath;
  }
});


axios.interceptors.request.use((request) =>
{
  axiosIsLoading.value = true
  axiosNbRequests.value++
  axiosMaxRequests.value++

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
  if (!('Content-Type' in request.headers))
  {
    if (request.method == 'patch')
    {
      request.headers['Content-Type'] = 'application/merge-patch+json'
    } else if (request.method == 'post')
    {
      request.headers['Content-Type'] = 'application/json'
    }
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


function interceptResponse(response)
{
  axiosIsLoading.value = true
  axiosNbRequests.value--

  if (axiosNbRequests.value <= 0)
  {
    axiosNbRequests.value = 0
    axiosMaxRequests.value = 0
    axiosIsLoading.value = false
  }
}

async function logout()
{
  await securityStore.logout()
  router.push({ name: 'login' });
}

//load mandatory data

if (securityStore.getIsAuthenticated())
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
