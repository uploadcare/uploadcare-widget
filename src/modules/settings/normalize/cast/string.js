/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'
import {boolean} from './boolean'

export const string: ValueTransformer<?string> = (value: any) => {
  if (!boolean(value)) {
    return null
  }

  if (typeof value !== 'string') {
    console.warn('Not a string')

    return null
  }

  return value
}
