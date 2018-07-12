/* @flow */
/* eslint-disable id-length, max-params */

import {i18n} from './i18n'
import * as hyperapp from 'hyperapp'

const i18nState = {locale: i18n.getLocale()}
const i18nActions = {setLocale: (locale: string) => ({locale})}

/**
 * Wrapper for HyperApp app object
 *
 * @export
 * @param {typeof hyperapp.app} app
 */
export function withLocales(app: typeof hyperapp.app) {
  return (state: any, actions: any, view: any, container: any) => {
    const appActions = app(
      {
        ...state,
        ...i18nState,
      },
      {
        ...actions,
        ...i18nActions,
      },
      view,
      container
    )

    i18n.onChange(() => {
      appActions.setLocale(i18n.getLocale())
    })

    return appActions
  }
}
