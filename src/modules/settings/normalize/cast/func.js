/* @flow */

import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const func: ValueTransformer<?Function> = (value: any) => {
  if (typeof value !== 'function') {
    throw new SettingsError('Not a function', null)
  }

  return value
}
