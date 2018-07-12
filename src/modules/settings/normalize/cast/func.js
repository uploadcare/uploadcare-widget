/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const func: ValueTransformer<?Function> = (value: any) => {
  if (typeof value !== 'function') {
    console.warn('Not a function')

    return null
  }

  return value
}
