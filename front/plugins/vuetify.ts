// front/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { bg, cs, de, en, es, fr, it, nl, pl, pt, ro } from 'vuetify/locale'
import { VDateInput } from 'vuetify/labs/VDateInput'

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  date: {
    locale: {
      en: 'fr-FR',
    },
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: import.meta.env.VITE_APP_I18N_LOCALE || 'fr',
    fallback: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'fr',
    messages: { bg, cs, de, en, es, fr, it, nl, pl, pt, ro },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1565c0",
          secondary: "#64b5f6",
          accent: "#78002e",
          error: "#d50000",
          warning: "#ffc107",
        }
      },
    },
  },
})

export default vuetify
