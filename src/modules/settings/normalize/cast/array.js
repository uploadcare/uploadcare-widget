/* @flow */

import {unique} from 'util/unique'
import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const array: ValueTransformer<?Array<string>> = (value: any) => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value !== 'string') {
    throw new SettingsError('Not a string', null)
  }

  if (!value.length) {
    return null
  }

  const arr = value
    .trim()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .map(el => el.trim())

  return unique(arr)
}
