/* @flow */

export type Pluralizer = (num: number) => string
export type Translations = {
  [key: string]: Translations | string
}

export type LocaleSpec = {|
  name: string,
  translations: Translations,
  pluralize: Pluralizer,
|}

export type Locale = {|
  translations: Translations,
  pluralize: Pluralizer,
|}
