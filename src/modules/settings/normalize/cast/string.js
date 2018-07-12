/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const string: ValueTransformer<?string> = (value: any) => {
  if (typeof value !== 'string') {
    console.warn('Not a string')

    return null
  }

  return value
}
