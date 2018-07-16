/* @flow */
import {defaults} from '../defaults'
import {camel2kebab} from 'helpers/case'
import type {UserSettings} from '../flow-typed/UserSettings'

/**
 * Get raw local settings passed via input attributes
 *
 * @export
 * @param {HTMLInputElement} input
 * @returns {UserSettings}
 */
export function fromAttributes(input: HTMLInputElement): UserSettings {
  return Object.keys(defaults).reduce((acc, key) => {
    const name = `data-${camel2kebab(key)}`
    const value = input.getAttribute(name)

    if (value !== null) {
      acc[key] = value
    }

    return acc
  }, {})
}
