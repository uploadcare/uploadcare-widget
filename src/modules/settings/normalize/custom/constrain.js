/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const constrain: (min: number, max: number) => ValueTransformer<number> = (min: number, max: number) => (
  value: number
) => Math.min(Math.max(value, min), max)
