/* @flow */

import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const int: ValueTransformer<?number> = (value: any) => {
  const result = parseInt(value)

  if (Number.isNaN(result)) {
    throw new SettingsError('not an integer', null)
  }

  return parseInt(value)
}
