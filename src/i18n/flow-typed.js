/* @flow */

export type Pluralizer = (num: number) => string
export type Translations = {
  [key: string]: Translations | string
}

export type LocalesMap = {[name: string]: Locale}
export type NamedParams = {[key: string]: string}
export type ChangeListener = () => void

export type LocaleSpec = {|
  name: string,
  translations: Translations,
  pluralize: Pluralizer,
|}

export type Locale = {|
  translations: Translations,
  pluralize: Pluralizer,
|}
