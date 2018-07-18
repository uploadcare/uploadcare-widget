/* @flow */

import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const func: ValueTransformer<mixed, ?Function> = (value: mixed) => {
  if (typeof value !== 'function') {
    throw new SettingsError('Not a function', null)
  }

  return value
}
