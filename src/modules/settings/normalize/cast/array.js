/* @flow */

import {unique} from 'util/unique'
import {boolean} from './boolean'
import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const array: ValueTransformer<mixed, ?Array<string>> = (value: mixed) => {
  if (!boolean(value)) {
    return null
  }

  if (typeof value !== 'string') {
    throw new SettingsError('Not a string', null)
  }

  if (!value.length) {
    return []
  }

  const arr = value
    .trim()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .map(el => el.trim())

  return unique(arr)
}
