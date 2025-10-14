import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import axios from './plugins/axios/axios'
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import router from './router'
import vueDebounce from 'vue-debounce'
import useCommonHelper from './helpers/commonHelper'

//custom directive to make te function effective
i18n.global.te = (key: Parameters<typeof i18n.global.te>[0], locale: Parameters<typeof i18n.global.te>[1]) =>
{
  const effectiveLocale = locale && locale.length ? locale : i18n.global.locale.value
  const messages = i18n.global.messages.value as { [key: string]: Record<string, unknown> }
  return Object.hasOwn(messages[effectiveLocale] || {}, key)
}

//custom directive to make $helpers and others accessible from typescript component
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties
  {
    $helpers: typeof helpers,
    $t: typeof i18n.global.t,
    $te: typeof i18n.global.te,
    $gravatarDefaultImage: string,
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(vuetify)

const helpers = useCommonHelper()
app.config.globalProperties.$axios = axios
app.config.globalProperties.$helpers = helpers
app.config.globalProperties.$gravatarDefaultImage = import.meta.env.VITE_GRAVATAR_DEFAULT_IMAGE
app.config.globalProperties.$legacyIntranetUrl = import.meta.env.VITE_INTRANET_LEGACY_URL
app.config.globalProperties.$getLegacyIntranetUrl = getLegacyIntranetUrl

function getLegacyIntranetUrl()
{
  let username = sessionStorage.getItem('username')
  let authToken = sessionStorage.getItem('authToken')
  if (null == username || null == authToken) {
    return app.config.globalProperties.$legacyIntranetUrl
  }
  return (
    app.config.globalProperties.$legacyIntranetUrl +
    '/admin/identification.php?identifiant=' +
    username +
    '&authToken=' +
    authToken
  )
}

app.directive('debounce', vueDebounce({ lock: true }))
  .mount('#app')
