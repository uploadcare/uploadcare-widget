import namespaceEn from './namespace.lang.en'
import { createPlugin } from './namespace.api'
import * as locales from '../locales'

const namespace = {
  ...namespaceEn,

  locale: {
    ...namespaceEn.locale,

    translations: Object.keys(locales).reduce((translations, lang) => {
      translations[lang] = locales[lang].translations

      return translations
    }, {}),

    pluralize: Object.keys(locales).reduce((pluralize, lang) => {
      pluralize[lang] = locales[lang].pluralize

      return pluralize
    }, {})
  }
}

const plugin = createPlugin(namespace)

export { plugin }
export default namespace
