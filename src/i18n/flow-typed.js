/* @flow */

export type Pluralizer = (num: number) => string
export type Translations = {
  [key: string]: Translations | string,
}

export type NamespacesMap = {
  [locale: string]: {|
    [namespace: string]: Namespace,
  |},
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

export type NamespaceSpec = {|
  locale: string,
  name: string,
  translations: Translations,
|}

export type Namespace = {|
  translations: Translations,
|}
