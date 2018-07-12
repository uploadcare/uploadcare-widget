/* @flow */
import type {UserSettings} from '../flow-typed/UserSettings'
import {defaults} from '../defaults'

/**
 * Merge global variables, local attributes and settings object
 * into single settings object
 *
 * @export
 * @param {UserSettings} fromGlobal
 * @param {UserSettings} fromAttributes
 * @param {UserSettings} fromOptions
 * @returns {UserSettings}
 */
export function merge(
  fromGlobal: UserSettings,
  fromAttributes: UserSettings,
  fromOptions: UserSettings
): UserSettings {
  return {
    ...defaults,
    ...fromGlobal,
    ...fromAttributes,
    ...fromOptions,
  }
}
