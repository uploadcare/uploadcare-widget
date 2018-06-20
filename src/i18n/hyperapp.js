/* @flow */
/* eslint-disable id-length */

import {i18n} from './i18n'

const state = {i18n: {locale: i18n.locale}}

const actions = {
  i18n: {
    set: (locale: string) => {
      i18n.setLocale(locale)

      return {locale}
    },
  },
}

export default {
  state,
  actions,
}
