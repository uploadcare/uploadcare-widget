import {
  ar,
  az,
  ca,
  cs,
  da,
  de,
  el,
  es,
  et,
  fr,
  he,
  it,
  ja,
  ko,
  lv,
  nb,
  nl,
  pl,
  pt,
  ro,
  ru,
  sk,
  sr,
  sv,
  tr,
  uk,
  vi,
  zhTW,
  zh
} from './locales'
import { t, rebuild } from './locale'

const uploadcare = {
  locale: {
    t,
    rebuild,

    translations: {
      ar: ar.translations,
      az: az.translations,
      ca: ca.translations,
      cs: cs.translations,
      da: da.translations,
      de: de.translations,
      el: el.translations,
      es: es.translations,
      et: et.translations,
      fr: fr.translations,
      he: he.translations,
      it: it.translations,
      ja: ja.translations,
      ko: ko.translations,
      lv: lv.translations,
      nb: nb.translations,
      nl: nl.translations,
      pl: pl.translations,
      pt: pt.translations,
      ro: ro.translations,
      ru: ru.translations,
      sk: sk.translations,
      sr: sr.translations,
      sv: sv.translations,
      tr: tr.translations,
      uk: uk.translations,
      vi: vi.translations,
      zhTW: zhTW.translations,
      zh: zh.translations
    },

    pluralize: {
      ar: ar.pluralize,
      az: az.pluralize,
      ca: ca.pluralize,
      cs: cs.pluralize,
      da: da.pluralize,
      de: de.pluralize,
      el: el.pluralize,
      es: es.pluralize,
      et: et.pluralize,
      fr: fr.pluralize,
      he: he.pluralize,
      it: it.pluralize,
      ja: ja.pluralize,
      ko: ko.pluralize,
      lv: lv.pluralize,
      nb: nb.pluralize,
      nl: nl.pluralize,
      pl: pl.pluralize,
      pt: pt.pluralize,
      ro: ro.pluralize,
      ru: ru.pluralize,
      sk: sk.pluralize,
      sr: sr.pluralize,
      sv: sv.pluralize,
      tr: tr.pluralize,
      uk: uk.pluralize,
      vi: vi.pluralize,
      zhTW: zhTW.pluralize,
      zh: zh.pluralize
    }
  },

  __exports: {},

  namespace: (path, fn) => {
    let target = uploadcare

    if (path) {
      const ref = path.split('.')

      for (let i = 0, len = ref.length; i < len; i++) {
        const part = ref[i]

        if (target[part]) {
          target[part] = {}
        }

        target = target[part]
      }
    }

    return fn(target)
  },

  expose: (key, value) => {
    const parts = key.split('.')
    const last = parts.pop()
    let target = uploadcare.__exports
    let source = uploadcare

    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i]
      if (target[part]) {
        target[part] = {}
      }

      target = target[part]
      source = source != null ? source[part] : undefined
    }

    target[last] = value || source[last]
  }
}

export default uploadcare
