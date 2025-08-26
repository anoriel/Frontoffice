<template>
  <v-app>
    <nav-bar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { useSecurityStore } from './stores/security'
import axios from './plugins/axios/axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const securityStore = useSecurityStore()

let axiosIsLoading = ref(false)
let axiosNbRequests = ref(0)
let axiosMaxRequests = ref(0)

axios.interceptors.request.use((request) => {
  axiosIsLoading = true
  axiosNbRequests++
  axiosMaxRequests++

  if (securityStore.switch_user && request.url.length) {
    if (request.url.includes('?')) {
      request.url += '&'
    } else {
      request.url += '?'
    }
    request.url += '_switch_user=' + this.getLoggedAs()
  }
  if (sessionStorage.getItem('JWTToken')) {
    request.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('JWTToken')
  }
  if (request.method == 'patch') {
    request.headers['Content-Type'] = 'application/merge-patch+json'
  } else if (request.method == 'post') {
    request.headers['Content-Type'] = 'application/json'
  }
  return request
})

axios.interceptors.response.use(
  (response) => {
    interceptResponse(response)
    return response
  },
  (err) => {
    interceptResponse(err)
    if (err.response.status === 401) {
      if (router.currentRoute.value.name != 'login') {
        securityStore.logout()
      }else{
        securityStore.disconnect()
      }
    } else if (err.response.status === 500 || err.response.status === 400) {
      console.log('Erreur lors de la mise à jour', err.response.data.error)
    } else if (err.response.status === 403) {
      err.response.data['description'] = 'accessDenied'
    }
    return new Promise(() => {
      throw err.response
    })
  },
)

function interceptResponse(response) {
  axiosIsLoading = true
  axiosNbRequests--

  if (axiosNbRequests <= 0) {
    axiosNbRequests = 0
    axiosMaxRequests = 0
    axiosIsLoading = false
  }
}

//load mandatory data
securityStore.loadRoleHierarchy()
securityStore.loadRoleHierarchyMap()
// securityStore.getApiMe()
</script>
