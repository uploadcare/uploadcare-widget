/* @flow */
import type {UserSettings} from '../flow-typed/UserSettings'

/**
 * Merge global variables, local attributes and settings object
 * into single settings object
 *
 * @export
 * @param {UserSettings} globals
 * @param {UserSettings} locals
 * @returns {UserSettings}
 */
export function merge(defaults: UserSettings, globals: UserSettings, locals: UserSettings): UserSettings {
  return {
    ...defaults,
    ...globals,
    ...locals,
  }
}
