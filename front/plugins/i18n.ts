import { createI18n, type I18nOptions } from 'vue-i18n'

import bg from '../locales/bg.json'
import cs from '../locales/cs.json'
import de from '../locales/de.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import it from '../locales/it.json'
import nl from '../locales/nl.json'
import pl from '../locales/pl.json'
import pt from '../locales/pt.json'
import ro from '../locales/ro.json'

const options: I18nOptions = {
  legacy: false, // you must set `false`, to use Composition API
  locale: import.meta.env.VITE_APP_I18N_LOCALE || 'fr',
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'fr',
  messages: { bg, cs, de, en, es, fr, it, nl, pl, pt, ro }
}

export default createI18n<false, typeof options>(options)
