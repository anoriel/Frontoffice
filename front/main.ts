import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import useCommonHelper from './helpers/commonHelper'
import axios from './plugins/axios/axios'
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import router from './router'
import 'vue3-flag-icons/styles'
import vueDebounce from 'vue-debounce'

const helpers = useCommonHelper()

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(vuetify)

app.config.globalProperties.$axios = axios
app.config.globalProperties.$helpers = helpers
app.config.globalProperties.$gravatarDefaultImage = import.meta.env.VITE_GRAVATAR_DEFAULT_IMAGE

app.directive('debounce', vueDebounce({ lock: true }))
  .mount('#app')
