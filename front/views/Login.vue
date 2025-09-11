<template>
  <v-main>
    <v-container>
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ $helpers.capitalizeFirstLetter($t('username')) }}
        </div>

        <v-text-field v-model="login" density="compact" :placeholder="$t('username')"
          prepend-inner-icon="mdi-account-circle" variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          {{ $helpers.capitalizeFirstLetter($t('password')) }}
        </div>

        <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'" density="compact"
          :placeholder="$helpers.capitalizeFirstLetter($t('password'))" prepend-inner-icon="mdi-lock-outline"
          variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

        <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="performLogin()">
          {{ $helpers.capitalizeFirstLetter($t('login')) }}
        </v-btn>

        <div v-if="securityStore.isLoading">
          <p>{{ $helpers.capitalizeFirstLetter($t('loading')) }}...</p>
        </div>

        <div v-else-if="securityStore.hasError">
          <error-message :error="securityStore.error" style="font-size: small" />
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import ErrorMessage from '../components/ErrorMessage.vue'
import { useSecurityStore } from '@/stores/security'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const securityStore = useSecurityStore()

const login = ref('')
const password = ref('')
const visible = ref(false)

let redirect = route.query.redirect

if (securityStore.getIsAuthenticated())
{
  if (typeof redirect !== 'undefined')
  {
    router.push({ path: redirect })
  } else
  {
    router.push({ name: 'home' })
  }
}

async function performLogin()
{
  let payload = { login: login.value, password: password.value },
    redirect = route.query.redirect

  await securityStore.login(payload)
  if (!securityStore.hasError)
  {
    let authToken = securityStore.getAuthToken()
    if (authToken != null)
    {
      sessionStorage.setItem('authToken', authToken)
    }
    let username = securityStore.getUsername()
    if (username != null)
    {
      sessionStorage.setItem('username', username)
    }
    if (typeof this.redirect !== 'undefined')
    {
      router.push({ path: this.redirect })
    } else
    {
      router.push({ name: 'home' })
    }
  }
}
</script>
