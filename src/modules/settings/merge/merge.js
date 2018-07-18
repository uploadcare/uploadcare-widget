/* @flow */
import type {UserSettings} from '../flow-typed/UserSettings'

/**
 * Merge defaults, globals and local settings into single settings object
 *
 * @export
 * @param {UserSettings} defaults
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
