/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const int: ValueTransformer<?number> = (value: any) => {
  const result = parseInt(value)

  if (Number.isNaN(result)) {
    console.warn('Not a number')

    return null
  }

  return parseInt(value)
}
