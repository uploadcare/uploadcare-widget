/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

/**
 * Format string as URL
 *
 * @param {string} value
 * @returns
 */
export const url: ValueTransformer<string, string> = (value: string) => {
  let protocol = document.location.protocol

  if (protocol !== 'http:') {
    protocol = 'https:'
  }

  return value.replace(/^\/\//, protocol + '//').replace(/\/+$/, '')
}
