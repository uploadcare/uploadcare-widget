/* @flow */
import {defaults} from '../defaults'
import {camel2upper} from '../../../helpers/case'
import type {UserSettings} from '../flow-typed/UserSettings'

/**
 * Get raw global settings passed via global variables
 *
 * @export
 * @returns {UserSettings}
 */
export function fromGlobal(): UserSettings {
  return Object.keys(defaults).reduce((acc, key) => {
    const value = window[`UPLOADCARE_${camel2upper(key)}`]

    if (typeof value !== 'undefined') {
      acc[key] = value
    }

    return acc
  }, {})
}
