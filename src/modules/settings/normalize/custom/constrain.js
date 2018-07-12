/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

export const constrain: (min: number, max: number) => ValueTransformer<any> = (min: number, max: number) => (
  value: any
) => Math.min(Math.max(value, min), max)
