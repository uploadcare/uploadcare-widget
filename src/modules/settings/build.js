/* @flow */

import type {UserSettings} from './flow-typed/UserSettings'
import type {Settings} from './flow-typed/Settings'
import {fromAttributes, fromGlobal} from './extract'
import {merge} from './merge'
import {normalize} from './normalize'
import {defaults} from './defaults'

/**
 * Build setting object from HTMLInputElement or UserSettings
 *
 * @export
 * @param {(HTMLInputElement | UserSettings)} obj
 */
export function build(obj: HTMLInputElement | UserSettings): Settings {
  let settingsArg: UserSettings

  if (obj instanceof HTMLInputElement) {
    settingsArg = fromAttributes(obj)
  }
  else {
    settingsArg = obj
  }

  const settings = merge(defaults, fromGlobal(), settingsArg)
  const normalized = normalize(settings)

  return normalized
}
