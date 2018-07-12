/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const boolean: ValueTransformer<?boolean> = (value: any) => {
  if (typeof value === 'string') {
    const str = value.trim().toLowerCase()

    return !['false', 'disabled'].includes(str)
  }

  return !!value
}
